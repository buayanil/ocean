package services

import com.typesafe.config.{Config, ConfigFactory}
import java.io.File
import play.api.Configuration
import org.specs2.mutable._


class TokenServiceSpec extends Specification {

  val myConfigFile = new File("conf/application.test.conf")
  val parsedConfig: Config = ConfigFactory.parseFile(myConfigFile)
  val configuration: Config = ConfigFactory.load(parsedConfig)

  def encode(issuer: String, expiresIn: Long = 172800): String = {
    val tokenService = new TokenService(new Configuration(configuration))
    tokenService.encode(issuer, expiresIn)
  }

  "TokenService#encode" should {
    "encode claim to token" in {
      // Arrange && Act
      val actual = encode("issuer")
      // Assert
      actual must startWith("ey")
    }
  }

  "TokenService#validate" should {
    "decode valid a token" in {
      // Arrange
      val token = encode("issuer")
      val tokenService = new TokenService(new Configuration(configuration))

      // Act
      val actual = tokenService.validate(token)

      // Assert
      (actual must be).equalTo(Right("issuer"))
    }

    "decode a token with an invalid signature" in {
      // Arrange
      val token = "ey...."
      val tokenService = new TokenService(new Configuration(configuration))

      // Act
      val actual = tokenService.validate(token)

      // Assert
      (actual.isLeft must be).equalTo(true)
    }

    "decode a token with an expired date" in {
      // Arrange
      val token = encode("issuer", expiresIn = -1)
      val tokenService = new TokenService(new Configuration(configuration))

      // Act
      val actual = tokenService.validate(token)

      // Assert
      (actual.isLeft must be).equalTo(true)
    }
  }
}