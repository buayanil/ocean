package com.htwhub.ocean.managers

import com.htwhub.ocean.engines.MongoDBEngine
import com.htwhub.ocean.engines.PostgreSQLEngine
import com.htwhub.ocean.managers.DatabaseManager.Exceptions
import com.htwhub.ocean.models.Instance
import com.htwhub.ocean.models.Instance.MongoDBSQLEngineType
import com.htwhub.ocean.models.Instance.PostgreSQLEngineType
import com.htwhub.ocean.models.InstanceId
import com.htwhub.ocean.models.User
import com.htwhub.ocean.serializers.CreateInstanceFormData
import com.htwhub.ocean.service.exceptions.ServiceException
import com.htwhub.ocean.service.InstanceService
import java.sql.Timestamp
import java.time.Instant
import javax.inject.Inject
import play.api.Logger
import scala.concurrent.ExecutionContext
import scala.concurrent.Future

class DatabaseManager @Inject() (
  instanceService: InstanceService,
  postgreSQLEngine: PostgreSQLEngine,
  mongoDBEngine: MongoDBEngine
)(implicit
  ec: ExecutionContext
) {

  val logger: Logger = Logger(this.getClass)

  def addDatabase(createInstanceFormData: CreateInstanceFormData, user: User): Future[Instance] = {
    val localInstance = Instance(
      InstanceId(0),
      user.id,
      createInstanceFormData.name,
      createInstanceFormData.engine,
      Timestamp.from(Instant.now)
    )
    instanceService
      .addInstance(localInstance, user.id)
      .recoverWith { case e: ServiceException => serviceErrorMapper(e) }
      .flatMap {
        case instance if instance.engine == PostgreSQLEngineType =>
          postgreSQLEngine
            .createDatabase(createInstanceFormData.name)
            .recoverWith { t: Throwable => internalError(t.getMessage) }
            .flatMap(_ => Future.successful(instance))
        case instance if instance.engine == MongoDBSQLEngineType =>
          mongoDBEngine
            .createDatabase(createInstanceFormData.name)
            .recoverWith { t: Throwable => internalError(t.getMessage) }
            .flatMap(_ => Future.successful(instance))
        // TODO: create related exception "engine not found"
        case _ => Future.failed(Exceptions.NotFound())
      }
  }

  /** Layer upstream transformation `ServiceException` to `ManagerException` */
  def serviceErrorMapper(exception: ServiceException): Future[Nothing] =
    exception match {
      case _: InstanceService.Exceptions.AccessDenied  => Future.failed(Exceptions.AccessDenied())
      case _: InstanceService.Exceptions.NotFound      => Future.failed(Exceptions.NotFound())
      case e: InstanceService.Exceptions.InternalError => Future.failed(Exceptions.InternalError(e.getMessage))
    }

  private def internalError(errorMessage: String): Future[Nothing] = {
    logger.error(errorMessage)
    Future.failed(Exceptions.InternalError(errorMessage))
  }

}

object DatabaseManager {
  object Exceptions {
    sealed abstract class DatabaseManagerException(message: String) extends ServiceException(message)

    final case class NotFound(message: String = "Database not found") extends DatabaseManagerException(message)
    final case class AccessDenied(message: String = "Access denied. You are not the database owner")
        extends DatabaseManagerException(message)
    final case class InternalError(message: String = "Internal error") extends DatabaseManagerException(message)
  }
}
