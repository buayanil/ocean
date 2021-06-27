package actions

import javax.inject.Inject
import play.api.Logging
import play.api.mvc._
import play.api.http.HeaderNames
import play.api.mvc.Results.Unauthorized
import play.api.libs.json.{Json, OWrites}
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.concurrent.duration.Duration

import models.{ErrorBody, ErrorMessage, User}
import repositories.UserRepository
import services.TokenService


case class UserRequest[A](user: User, request: Request[A]) extends WrappedRequest[A](request)


class UserAction @Inject() (bodyParser: BodyParsers.Default, tokenService: TokenService, userRepository: UserRepository)(implicit ec: ExecutionContext) extends ActionBuilder[UserRequest, AnyContent] with Logging {

  private val headerTokenRegex = """Bearer (.+?)""".r

  override def parser: BodyParser[AnyContent] = bodyParser



  override def invokeBlock[A](request: Request[A], block: UserRequest[A] => Future[Result]): Future[Result] = {
    logger.info("UserAction - " + request)

    extractBearerToken(request) match {
      case None => Future.successful(Unauthorized(Json.toJson(ErrorBody(List(ErrorMessage(ErrorMessage.CODE_JWT_BEARER_MISSING, "Bearer token required"))))))
      case Some(token) => tokenService.validate(token) match {
        case Left(errors) => Future.successful(Unauthorized(Json.toJson(ErrorBody(List(errors)))))
        case Right(username) => Await.result(userRepository.getByUsername(username), Duration.Inf) match {
          case None => Future.successful(Unauthorized(Json.toJson(ErrorBody(List(ErrorMessage(ErrorMessage.CODE_JWT_INVALID_ISSUER, "Invalid issuer"))))))
          case Some(user) =>  block(UserRequest(user, request))
        }
      }
    }
  }

  private def extractBearerToken[A](request: Request[A]): Option[String] =
    request.headers.get(HeaderNames.AUTHORIZATION) collect {
      case headerTokenRegex(token) => token
    }

  override protected def executionContext: ExecutionContext = ec

}