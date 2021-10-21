package services

import java.io.IOException
import javax.inject._
import org.apache.directory.api.ldap.model.cursor.{CursorException, EntryCursor}
import org.apache.directory.api.ldap.model.entry.Entry
import org.apache.directory.api.ldap.model.exception.{LdapAuthenticationException, LdapException, LdapInvalidAttributeValueException}
import org.apache.directory.api.ldap.model.message.SearchScope
import org.apache.directory.ldap.client.api.exception.InvalidConnectionException
import org.apache.directory.ldap.client.api.{LdapConnectionConfig, LdapNetworkConnection}
import play.api.{Configuration, Logger}
import scala.collection.mutable.ListBuffer

import models.{ErrorMessage, LdapUser}


class LdapService @Inject()(config: Configuration) {

  val logger: Logger = Logger(this.getClass)

  def authenticate(username: String, password: String): Either[List[ErrorMessage], LdapUser] = {
    val ldapConnectionConfig = getLdapConnectionConfig(username, password)
    ldapConnectionConfig match {
      case Right(config) => fetchLdapRole(config, username) match {
        case Right(entry) => getProfileFor(entry, username) match {
          case Right(ldapUser) => Right(ldapUser)
          case Left(error) =>
            logger.error(error.toString)
            Left(List(error))
        }
        case Left(error) =>
          logger.warn(error.toString)
          Left(List(error))
      }
      case Left(errors) =>
        logger.error(errors.toString)
        Left(errors)
    }
  }

  def getProfileFor(entry: Entry, username: String): Either[ErrorMessage, LdapUser] = {
    try {
      val firstName = getStringWithFallBack(entry, "givenName", "Undefined")
      val lastName = getStringWithFallBack(entry, "sn", "Undefined")
      val mail = getStringWithFallBack(entry, "mail", "")
      val employeeType = getStringWithFallBack(entry, "employeetype", "Uncategorized")
      Right(LdapUser(username, firstName, lastName, mail, employeeType))
    } catch {
      case e: LdapInvalidAttributeValueException =>
        Left(ErrorMessage(ErrorMessage.CODE_LDAP_ENTRY_MISSING, ErrorMessage.MESSAGE_LDAP_ENTRY_MISSING, developerMessage=e.getMessage))
    }
  }

  private def getStringWithFallBack(entry: Entry, key: String, fallBack: String): String = {
    try {
      entry.get(key).getString
    } catch {
      case e: NullPointerException =>
        val errorMessage = ErrorMessage(ErrorMessage.CODE_LDAP_ENTRY_MISSING, ErrorMessage.MESSAGE_LDAP_ENTRY_MISSING, developerMessage=e.getMessage)
        logger.warn(errorMessage.toString)
        fallBack
    }
  }

  def fetchLdapRole(ldapConnectionConfig: LdapConnectionConfig, username: String): Either[ErrorMessage, Entry] = {
    val ldapUserRoot = config.getOptional[String]("ldap.userRoot")

    var ldapConnection: LdapNetworkConnection = null
    try {
      ldapConnection = new LdapNetworkConnection(ldapConnectionConfig)
      ldapConnection.bind()
    } catch {
      case e: InvalidConnectionException =>
        return Left(ErrorMessage(ErrorMessage.CODE_LDAP_AUTHENTICATION_FAILED, ErrorMessage.MESSAGE_LDAP_AUTHENTICATION_FAILED, developerMessage=e.getMessage))
      case e: LdapAuthenticationException =>
        return Left(ErrorMessage(ErrorMessage.CODE_LDAP_AUTHENTICATION_FAILED, ErrorMessage.MESSAGE_LDAP_AUTHENTICATION_FAILED, developerMessage=e.getMessage))
      case e: LdapException =>
        return Left(ErrorMessage(ErrorMessage.CODE_LDAP_AUTHENTICATION_FAILED, ErrorMessage.MESSAGE_LDAP_AUTHENTICATION_FAILED, developerMessage=e.getMessage))
    }

    var entry: Entry = null
    val filter = s"(cn=$username)"
    try {
      var entryCursor: EntryCursor = null
      entryCursor = ldapConnection.search(ldapUserRoot.getOrElse(""), filter, SearchScope.ONELEVEL, "*")
      entryCursor.next()
      entry = entryCursor.get();
    } catch {
      case e: CursorException =>
        return Left(ErrorMessage(ErrorMessage.CODE_LDAP_CURSOR_FAILED, ErrorMessage.MESSAGE_LDAP_AUTHENTICATION_FAILED, developerMessage=e.getMessage))
      case e: LdapException =>
        return Left(ErrorMessage(ErrorMessage.CODE_LDAP_CURSOR_FAILED, ErrorMessage.MESSAGE_LDAP_AUTHENTICATION_FAILED, developerMessage=e.getMessage))
    }

    try {
      ldapConnection.close()
    } catch {
      case e: LdapException =>
        return Left(ErrorMessage(ErrorMessage.CODE_LDAP_CLOSING_FAILED, ErrorMessage.MESSAGE_LDAP_AUTHENTICATION_FAILED, developerMessage=e.getMessage))
      case e: IOException =>
        return Left(ErrorMessage(ErrorMessage.CODE_LDAP_CLOSING_FAILED, ErrorMessage.MESSAGE_LDAP_AUTHENTICATION_FAILED, developerMessage=e.getMessage))
    }

    Right(entry)
  }

  def getLdapConnectionConfig(username: String, password: String): Either[List[ErrorMessage], LdapConnectionConfig] = {
    val errors = ListBuffer[ErrorMessage]()
    val ldapConnectionConfig = new LdapConnectionConfig()

    val ldapHost = config.getOptional[String]("ldap.host")
    ldapHost match {
      case Some(value) => ldapConnectionConfig.setLdapHost(value)
      case _ =>
        errors += ErrorMessage(ErrorMessage.CODE_LDAP_CONNECTION_CONFIG, ErrorMessage.MESSAGE_LDAP_CONNECTION_CONFIG, developerMessage="Could not load ldap host.")
    }

    val ldapPort = config.getOptional[Int]("ldap.port")
    ldapPort match {
      case Some(value) if value > 0 => ldapConnectionConfig.setLdapPort(value)
      case _ =>
        errors += ErrorMessage(ErrorMessage.CODE_LDAP_CONNECTION_CONFIG, ErrorMessage.MESSAGE_LDAP_CONNECTION_CONFIG, developerMessage="Could not load ldap port.")
    }

    val ldapStartTls = config.getOptional[Boolean]("ldap.startTls")
    ldapStartTls match {
      case Some(value: Boolean) => ldapConnectionConfig.setUseTls(value)
      case _ =>
        errors += ErrorMessage(ErrorMessage.CODE_LDAP_CONNECTION_CONFIG, ErrorMessage.MESSAGE_LDAP_CONNECTION_CONFIG, developerMessage="Could not load ldap useTls.")
    }

    val ldapUseSsl = config.getOptional[Boolean]("ldap.useSsl")
    ldapUseSsl match {
      case Some(value: Boolean) => ldapConnectionConfig.setUseSsl(value)
      case _ =>
        errors += ErrorMessage(ErrorMessage.CODE_LDAP_CONNECTION_CONFIG, ErrorMessage.MESSAGE_LDAP_CONNECTION_CONFIG, developerMessage="Could not load ldap useSsl.")
    }

    val ldapUserRoot = config.getOptional[String]("ldap.userRoot")
    ldapUserRoot match {
      case Some(userRoot) =>
        val ldapName = config.getOptional[String]("ldap.name")
        ldapName match {
          case Some(ldapName) => ldapConnectionConfig.setName(ldapName
            .replace("%USER%", username)
            .replace("%USER_ROOT%", userRoot))
          case _ =>
            errors += ErrorMessage(ErrorMessage.CODE_LDAP_CONNECTION_CONFIG, ErrorMessage.MESSAGE_LDAP_CONNECTION_CONFIG, developerMessage="Could not load ldap name.")
        }
      case _ =>
        errors += ErrorMessage(ErrorMessage.CODE_LDAP_CONNECTION_CONFIG, ErrorMessage.MESSAGE_LDAP_CONNECTION_CONFIG, developerMessage="Could not load ldap userRoot.")
    }

    ldapConnectionConfig.setCredentials(password)

    errors match {
      case ListBuffer() => Right(ldapConnectionConfig)
      case _ => Left(errors.toList)
    }
  }
}
