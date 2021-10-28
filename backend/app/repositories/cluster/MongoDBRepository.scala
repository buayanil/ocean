package repositories.cluster


import com.mongodb.{MongoClientSettings, ServerAddress}
import org.mongodb.scala.MongoClient
import play.api.Configuration
import javax.inject.{Inject, Singleton}
import com.mongodb.MongoCredential._
import org.mongodb.scala.bson._
import org.mongodb.scala.bson.collection.mutable.Document
import scala.util.{Failure, Success, Try}
import scala.jdk.CollectionConverters._
import scala.concurrent.{ExecutionContext, Future}



@Singleton
class MongoDBRepository @Inject()(config: Configuration)(implicit ec: ExecutionContext) {

  val initialCollection: String = config.get[String]("mongodb_cluster.initialCollection")
  val mongoClient: MongoClient = MongoClient(getMongoClientSettings)

  private def getMongoClientSettings: MongoClientSettings  = {
    val serverName = config.get[String]("mongodb_cluster.serverName")
    val databaseName = config.get[String]("mongodb_cluster.databaseName")
    val portNumber = config.get[Int]("mongodb_cluster.portNumber")
    val username = config.get[String]("mongodb_cluster.username")
    val password = config.get[String]("mongodb_cluster.password")

    val credential = createCredential(username, databaseName, password.toCharArray)
    MongoClientSettings.builder()
      .applyToClusterSettings(block => block.hosts(List(new ServerAddress(serverName, portNumber)).asJava))
      .credential(credential)
      .build()
  }

  def createDatabase(databaseName: String): Future[Try[Boolean]] = {
    val database = mongoClient.getDatabase(databaseName)
    database.createCollection(initialCollection)
      .toFuture()
      .map(_ => Success(true))
      .recoverWith {
        case e: Throwable => handleThrowable(e)
      }
  }

  def createUser(databaseName: String, username: String, password: String): Future[Try[Boolean]] = {
    val readWriteRoleDoc = Document(
      "role" -> BsonString("readWrite"),
      "db" -> BsonString(databaseName)
    )
    val createUserDoc = Document(
      "createUser" -> BsonString(username),
      "pwd" -> BsonString(password),
      "roles" -> BsonArray(readWriteRoleDoc)
    )
    processCommand(databaseName, createUserDoc)
  }

  def deleteUser(databaseName: String, username: String): Future[Try[Boolean]] = {
    val dropUserDoc = Document(
      "dropUser" -> BsonString(username)
    )
    processCommand(databaseName, dropUserDoc)
  }

  private def processCommand(databaseName: String, document: Document): Future[Try[Boolean]] = {
    val database = mongoClient.getDatabase(databaseName)
    database.runCommand(document)
      .toFuture()
      .map(_ => {
        Success(true)
      })
      .recoverWith {
        case e: Throwable => handleThrowable(e)
      }
  }

  /**
   * runCommand throws a CodecConfigurationException.
   * Therefore we just ignore this exception, until there is a fix.
   */
  private def handleThrowable(e: Throwable): Future[Try[Boolean]] = {
    e match {
      case value: UnsupportedOperationException => Future.successful(Success(true))
      case _ => Future.successful(Failure(e))
    }
  }

}