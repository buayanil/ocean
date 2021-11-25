package com.htwhub.ocean.service

import com.htwhub.ocean.models.UserId
import com.htwhub.ocean.serializers.auth.AccessTokenContent
import com.htwhub.ocean.serializers.auth.AuthContent
import com.htwhub.ocean.serializers.auth.AuthResponse
import com.htwhub.ocean.serializers.auth.RefreshTokenContent
import java.time.Instant
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
  val hmacAlgorithm: JwtHmacAlgorithm = JwtAlgorithm.HS256
  val accessExpirationTimeInSeconds = 3600
  val refreshExpirationTimeInSeconds = 86400

  def obtainTokens(
    accessTokenContent: AccessTokenContent,
    refreshTokenContent: RefreshTokenContent,
    currentTimestamp: Long
  ): AuthResponse = {
    val newAccessToken = getAuthToken(accessTokenContent, currentTimestamp, accessExpirationTimeInSeconds)
    val newRefreshToken = getAuthToken(refreshTokenContent, currentTimestamp, refreshExpirationTimeInSeconds)
    AuthResponse(newAccessToken, newRefreshToken)
  }

  def refreshTokens(refreshToken: String, currentTimestamp: Long): Option[AuthResponse] =
    getOptJwtClaims(refreshToken)
      .filter(_.expiration.exists(_ > currentTimestamp))
      .map(claims => Json.parse(claims.content).as[AuthContent])
      .collect { case refreshTokenContent: RefreshTokenContent =>
        val accessTokenContent = AccessTokenContent(refreshTokenContent.userId)
        val newAccessToken = getAuthToken(accessTokenContent, currentTimestamp, accessExpirationTimeInSeconds)
        AuthResponse(newAccessToken, refreshToken)
      }

  def getAuthToken(authContent: AuthContent, currentTimestamp: Long, lifetime: Long): String = {
    val claims = JwtClaim(
      content = Json.stringify(Json.toJson(authContent)),
      expiration = Some(currentTimestamp + lifetime),
      issuedAt = Some(currentTimestamp)
    )
    Jwt.encode(claims, SECRET_KEY, hmacAlgorithm)
  }

  def getOptJwtClaims(jwt: String): Option[JwtClaim] =
    Jwt.decode(jwt, SECRET_KEY, Seq(hmacAlgorithm)).toOption

}
