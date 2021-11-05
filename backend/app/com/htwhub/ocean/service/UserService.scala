package com.htwhub.ocean.service

import com.htwhub.ocean.concurrent.DatabaseContexts.SimpleDbLookupsContext
import com.htwhub.ocean.models.User
import com.htwhub.ocean.models.UserId
import com.htwhub.ocean.repositories.UserRepository
import com.htwhub.ocean.service.exceptions.ServiceException
import com.htwhub.ocean.service.UserService.Exceptions
import javax.inject.Inject
import javax.inject.Singleton
import play.api.Logger
import scala.concurrent.Future

@Singleton
class UserService @Inject() (
  userRepository: UserRepository,
)(implicit
  simpleDbLookupsContext: SimpleDbLookupsContext,
) {

  val logger: Logger = Logger(this.getClass)

  def getUserById(userId: UserId): Future[User] =
    userRepository
      .getUserById(userId)
      .recoverWith { case t: Throwable => internalError(t.getMessage) }
      .flatMap {
        case None       => notFoundUserError(userId)
        case Some(user) => Future.successful(user)
      }

  def getUsersByIds(userIds: List[UserId]): Future[List[User]] = {
    val jobs = userIds map { userId => getUserById(userId) }
    Future.sequence(jobs)
  }

  private def internalError(errorMessage: String): Future[Nothing] = {
    logger.error(errorMessage)
    Future.failed(Exceptions.InternalError(errorMessage))
  }

  private def notFoundUserError(userId: UserId) =
    Future.failed(Exceptions.NotFound(s"There is no user with user_id: ${userId.value}"))

}

object UserService {
  object Exceptions {
    sealed abstract class UserServiceException(message: String) extends ServiceException(message)

    final case class NotFound(message: String = "User not found") extends UserServiceException(message)
    final case class AccessDenied(message: String = "Access denied. You are not the instance owner")
        extends UserServiceException(message)
    final case class InternalError(message: String = "Internal error") extends UserServiceException(message)
  }
}
