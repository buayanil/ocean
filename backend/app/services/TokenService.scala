package services

import javax.inject.Inject
import java.time.Clock
import pdi.jwt.algorithms.JwtHmacAlgorithm
import pdi.jwt.{Jwt, JwtAlgorithm, JwtClaim}
import play.api.Configuration
import scala.util.{Failure, Success}


class TokenService @Inject()(configuration: Configuration) {

  val SECRET_KEY: String = configuration.getOptional[String]("jwt.secret_key").getOrElse("")
  val ALGO_TYPE: JwtHmacAlgorithm = JwtAlgorithm.HS256

  def encode(issuer: String, expiresIn: Long = 172800): String = {
    implicit val clock: Clock = Clock.systemUTC
    val claim = JwtClaim().issuedNow.expiresIn(expiresIn).by(issuer)
    Jwt.encode(claim, SECRET_KEY, ALGO_TYPE)
  }

  def validate(token: String): Either[List[String], String] = {
    if (Jwt.isValid(token, SECRET_KEY, Seq(ALGO_TYPE))) {
      Jwt.decode(token, SECRET_KEY, Seq(ALGO_TYPE)) match {
        case Success(jwtClaim) => jwtClaim.issuer match {
          case Some(issuer) => Right(issuer)
          case None => Left(List("Issuer Claim missing"))
        }
        case Failure(e) => Left(List(e.toString))
      }
    } else {
      Left(List("Invalid signature for this token or wrong algorithm."))
    }
  }

}
