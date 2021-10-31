package actions

import javax.inject.Inject
import models.ErrorMessage
import models.ErrorResponse
import models.User
import play.api.http.HeaderNames
import play.api.libs.json.Json
import play.api.mvc._
import play.api.mvc.Results.Unauthorized
import play.api.Logging
import repositories.UserRepository
import scala.concurrent.duration.Duration
import scala.concurrent.Await
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import services.TokenService

case class UserRequest[A](user: User, request: Request[A]) extends WrappedRequest[A](request)

class UserAction @Inject() (
  bodyParser: BodyParsers.Default,
  tokenService: TokenService,
  userRepository: UserRepository
)(implicit ec: ExecutionContext)
    extends ActionBuilder[UserRequest, AnyContent]
    with Logging {

  private val headerTokenRegex = """Bearer (.+?)""".r

  override def parser: BodyParser[AnyContent] = bodyParser

  override def invokeBlock[A](request: Request[A], block: UserRequest[A] => Future[Result]): Future[Result] = {
    def getLoggerMessageFor(request: Request[A]): String =
      s"RemoteAddress: ${request.remoteAddress} Method: ${request.method} URI: ${request.uri} Body ${request.body}"

    logger.info(getLoggerMessageFor(request))

    extractBearerToken(request) match {
      case None =>
        Future.successful(
          Unauthorized(
            Json.toJson(
              ErrorResponse(List(ErrorMessage(ErrorMessage.CODE_JWT_BEARER_MISSING, "Bearer token required")))
            )
          )
        )
      case Some(token) =>
        tokenService.validate(token) match {
          case Left(errors) => Future.successful(Unauthorized(Json.toJson(ErrorResponse(List(errors)))))
          case Right(username) =>
            Await.result(userRepository.getByUsername(username), Duration.Inf) match {
              case None =>
                Future.successful(
                  Unauthorized(
                    Json.toJson(
                      ErrorResponse(List(ErrorMessage(ErrorMessage.CODE_JWT_INVALID_ISSUER, "Invalid issuer")))
                    )
                  )
                )
              case Some(user) => block(UserRequest(user, request))
            }
        }
    }
  }

  private def extractBearerToken[A](request: Request[A]): Option[String] =
    request.headers.get(HeaderNames.AUTHORIZATION) collect { case headerTokenRegex(token) =>
      token
    }

  protected override def executionContext: ExecutionContext = ec

}
