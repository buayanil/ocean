package com.htwhub.ocean.service

import com.htwhub.ocean.serializers.auth.AccessTokenContent
import com.htwhub.ocean.serializers.auth.AuthContent
import com.htwhub.ocean.serializers.auth.AuthResponse
import com.htwhub.ocean.serializers.auth.RefreshTokenContent
import javax.inject.Inject
import pdi.jwt.algorithms.JwtHmacAlgorithm
import pdi.jwt.Jwt
import pdi.jwt.JwtAlgorithm
import pdi.jwt.JwtClaim
import play.api.libs.json.Json
import play.api.Configuration
import play.api.Logger

class TokenService @Inject() (configuration: Configuration) {

  val logger: Logger = Logger(this.getClass)

  val SECRET_KEY: String = configuration.get[String]("jwt.secret_key")
  val ALGO_TYPE: JwtHmacAlgorithm = JwtAlgorithm.HS256

  def getAuthResponse(
    accessTokenContent: AccessTokenContent,
    refreshTokenContent: RefreshTokenContent,
    currentTimestamp: Long
  ): AuthResponse = {
    val newAccessToken = getAuthToken(accessTokenContent, currentTimestamp)
    val newRefreshToken = getAuthToken(refreshTokenContent, currentTimestamp)
    AuthResponse(newAccessToken, newRefreshToken, currentTimestamp)
  }

  private def getAuthToken(authContent: AuthContent, currentTimestamp: Long, lifetime: Long = 172800): String = {
    val claims = JwtClaim(
      content = Json.stringify(Json.toJson(authContent)),
      expiration = Some(currentTimestamp + lifetime),
      issuedAt = Some(currentTimestamp)
    )
    Jwt.encode(claims, SECRET_KEY, ALGO_TYPE)
  }

  def getClaims(jwt: String): Option[AccessTokenContent] =
    Jwt.decode(jwt, SECRET_KEY, Seq(ALGO_TYPE)).toOption match {
      case None => None
      // TODO: validate json parse for AuthContent
      case Some(claim) => Some(Json.parse(claim.content).as[AccessTokenContent])
    }

}
