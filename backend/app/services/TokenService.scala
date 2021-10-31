package services

import java.time.Clock
import javax.inject.Inject
import models.ErrorMessage
import pdi.jwt.algorithms.JwtHmacAlgorithm
import pdi.jwt.Jwt
import pdi.jwt.JwtAlgorithm
import pdi.jwt.JwtClaim
import play.api.Configuration
import play.api.Logger
import scala.util.Failure
import scala.util.Success

class TokenService @Inject() (configuration: Configuration) {

  val logger: Logger = Logger(this.getClass)
  val SECRET_KEY: String = configuration.getOptional[String]("jwt.secret_key").getOrElse("")
  val ALGO_TYPE: JwtHmacAlgorithm = JwtAlgorithm.HS256

  def encode(issuer: String, expiresIn: Long = 172800): String = {
    implicit val clock: Clock = Clock.systemUTC
    val claim = JwtClaim().issuedNow.expiresIn(expiresIn).by(issuer)
    Jwt.encode(claim, SECRET_KEY, ALGO_TYPE)
  }

  def validate(token: String): Either[ErrorMessage, String] =
    if (Jwt.isValid(token, SECRET_KEY, Seq(ALGO_TYPE))) {
      Jwt.decode(token, SECRET_KEY, Seq(ALGO_TYPE)) match {
        case Success(jwtClaim) =>
          jwtClaim.issuer match {
            case Some(issuer) => Right(issuer)
            case None =>
              val errorMessage =
                ErrorMessage(ErrorMessage.CODE_JWT_ISSUER_MISSING, ErrorMessage.MESSAGE_JWT_ISSUER_MISSING)
              logger.warn(errorMessage.toString)
              Left(errorMessage)
          }
        case Failure(e) =>
          val errorMessage = ErrorMessage(
            ErrorMessage.CODE_JWT_INVALID_SIGNATURE,
            ErrorMessage.MESSAGE_JWT_INVALID_SIGNATURE,
            developerMessage = e.getMessage
          )
          logger.warn(errorMessage.toString)
          Left(errorMessage)
      }
    } else {
      val errorMessage =
        ErrorMessage(ErrorMessage.CODE_JWT_INVALID_SIGNATURE, ErrorMessage.MESSAGE_JWT_INVALID_SIGNATURE)
      logger.warn(errorMessage.toString)
      Left(errorMessage)
    }

}
