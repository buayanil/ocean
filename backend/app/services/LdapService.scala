package services

import org.apache.directory.api.ldap.model.cursor.{CursorException, EntryCursor}
import org.apache.directory.api.ldap.model.entry.Entry
import org.apache.directory.api.ldap.model.exception.{LdapAuthenticationException, LdapException, LdapInvalidAttributeValueException}
import org.apache.directory.api.ldap.model.message.SearchScope
import org.apache.directory.ldap.client.api.exception.InvalidConnectionException
import org.apache.directory.ldap.client.api.{LdapConnectionConfig, LdapNetworkConnection}
import java.io.IOException
import javax.inject._
import play.api.Configuration
import scala.collection.mutable.ListBuffer

import models.{ErrorMessage, LdapUser}


class LdapService @Inject()(config: Configuration) {

  def authenticate(username: String, password: String): Either[List[ErrorMessage], LdapUser] = {
    val ldapConnectionConfig = getLdapConnectionConfig(username, password)
    ldapConnectionConfig match {
      case Right(config) => fetchLdapRole(config, username) match {
        case Right(entry) => getProfileFor(entry, username) match {
          case Right(ldapUser) => Right(ldapUser)
          case Left(error) => Left(List(error))
        }
        case Left(error) => Left(List(error))
      }
      case Left(errors) => Left(errors)
    }
  }

  def getProfileFor(entry: Entry, username: String): Either[ErrorMessage, LdapUser] = {
    try {
      val firstName = entry.get("givenName").getString
      val lastName = entry.get("sn").getString
      val mail = entry.get("mail").getString
      val employeeType = entry.get("employeetype").getString
      Right(LdapUser(username, firstName, lastName, mail, employeeType))
    } catch {
      case e: LdapInvalidAttributeValueException => Left(ErrorMessage(ErrorMessage.CODE_LDAP_ENTRY_MISSING, e.getMessage))
    }
  }

  def fetchLdapRole(ldapConnectionConfig: LdapConnectionConfig, username: String): Either[ErrorMessage, Entry] = {
    val ldapUserRoot = config.getOptional[String]("ldap.userRoot")

    var ldapConnection: LdapNetworkConnection = null
    try {
      ldapConnection = new LdapNetworkConnection(ldapConnectionConfig)
      ldapConnection.bind()
    } catch {
      case e: InvalidConnectionException => return Left(ErrorMessage(ErrorMessage.CODE_LDAP_AUTHENTICATION_FAILED, e.getMessage))
      case e: LdapAuthenticationException => return Left(ErrorMessage(ErrorMessage.CODE_LDAP_AUTHENTICATION_FAILED, e.getMessage))
      case e: LdapException => return Left(ErrorMessage(ErrorMessage.CODE_LDAP_AUTHENTICATION_FAILED, e.getMessage))
    }

    var entry: Entry = null
    val filter = s"(cn=$username)"
    try {
      var entryCursor: EntryCursor = null
      entryCursor = ldapConnection.search(ldapUserRoot.getOrElse(""), filter, SearchScope.ONELEVEL, "*")
      entryCursor.next()
      entry = entryCursor.get();
    } catch {
      case e: CursorException => return Left(ErrorMessage(ErrorMessage.CODE_LDAP_CURSOR_FAILED, e.getMessage))
      case e: LdapException => return Left(ErrorMessage(ErrorMessage.CODE_LDAP_CURSOR_FAILED, e.getMessage))
    }

    try {
      ldapConnection.close()
    } catch {
      case e: LdapException => return Left(ErrorMessage(ErrorMessage.CODE_LDAP_CLOSING_FAILED, e.getMessage))
      case e: IOException => return Left(ErrorMessage(ErrorMessage.CODE_LDAP_CLOSING_FAILED, e.getMessage))
    }

    Right(entry)
  }

  def getLdapConnectionConfig(username: String, password: String): Either[List[ErrorMessage], LdapConnectionConfig] = {
    val errors = ListBuffer[ErrorMessage]()
    val ldapConnectionConfig = new LdapConnectionConfig()

    val ldapHost = config.getOptional[String]("ldap.host")
    ldapHost match {
      case Some(value) => ldapConnectionConfig.setLdapHost(value)
      case _ => errors += ErrorMessage(ErrorMessage.CODE_LDAP_CONNECTION_CONFIG ,"Could not load ldap host.")
    }

    val ldapPort = config.getOptional[Int]("ldap.port")
    ldapPort match {
      case Some(value) if value > 0 => ldapConnectionConfig.setLdapPort(value)
      case _ => errors += ErrorMessage(ErrorMessage.CODE_LDAP_CONNECTION_CONFIG, "Could not load ldap port.")
    }

    val ldapStartTls = config.getOptional[Boolean]("ldap.startTls")
    ldapStartTls match {
      case Some(value: Boolean) => ldapConnectionConfig.setUseTls(value)
      case _ => errors += ErrorMessage(ErrorMessage.CODE_LDAP_CONNECTION_CONFIG ,"Could not load ldap useTls.")
    }

    val ldapUseSsl = config.getOptional[Boolean]("ldap.useSsl")
    ldapUseSsl match {
      case Some(value: Boolean) => ldapConnectionConfig.setUseSsl(value)
      case _ => errors += ErrorMessage(ErrorMessage.CODE_LDAP_CONNECTION_CONFIG ,"Could not load ldap useSsl.")
    }

    val ldapUserRoot = config.getOptional[String]("ldap.userRoot")
    ldapUserRoot match {
      case Some(userRoot) =>
        val ldapName = config.getOptional[String]("ldap.name")
        ldapName match {
          case Some(ldapName) => ldapConnectionConfig.setName(ldapName
            .replace("%USER%", username)
            .replace("%USER_ROOT%", userRoot))
          case _ => errors += ErrorMessage(ErrorMessage.CODE_LDAP_CONNECTION_CONFIG ,"Could not load ldap name.")
        }
      case _ => errors += ErrorMessage(ErrorMessage.CODE_LDAP_CONNECTION_CONFIG ,"Could not load ldap userRoot.")
    }

    ldapConnectionConfig.setCredentials(password)

    errors match {
      case ListBuffer() => Right(ldapConnectionConfig)
      case _ => Left(errors.toList)
    }
  }
}
