package services

import models.LdapProfile
import org.apache.directory.api.ldap.model.cursor.{CursorException, EntryCursor}
import org.apache.directory.api.ldap.model.entry.Entry
import org.apache.directory.api.ldap.model.exception.{LdapAuthenticationException, LdapException, LdapInvalidAttributeValueException}
import org.apache.directory.api.ldap.model.message.SearchScope
import org.apache.directory.ldap.client.api.exception.InvalidConnectionException
import org.apache.directory.ldap.client.api.{LdapConnectionConfig, LdapNetworkConnection}
import play.api.Configuration

import java.io.IOException
import javax.inject._
import scala.collection.mutable.ListBuffer


class LdapService @Inject()(config: Configuration) {

  def authenticate(username: String, password: String): Either[List[String], LdapProfile] = {
    val ldapConnectionConfig = getLdapConnectionConfig(username, password)
    ldapConnectionConfig match {
      case Right(config) => fetchLdapRole(config, username) match {
        case Right(entry) => getProfileFor(entry, username) match {
          case Right(ldapProfile) => Right(ldapProfile)
          case Left(error) => Left(List(error))
        }
        case Left(error) => Left(List(error))
      }
      case Left(errors) => Left(errors)
    }
  }

  def getProfileFor(entry: Entry, username: String): Either[String, LdapProfile] = {
    try {
      val firstName = entry.get("givenName").getString
      val lastName = entry.get("sn").getString
      val mail = entry.get("mail").getString
      val employeeType = entry.get("employeetype").getString
      Right(LdapProfile(firstName, lastName, mail, employeeType))
    } catch {
      case e: LdapInvalidAttributeValueException => Left(e.toString)
    }
  }

  def fetchLdapRole(ldapConnectionConfig: LdapConnectionConfig, username: String): Either[String, Entry] = {
    val ldapUserRoot = config.getOptional[String]("ldap.userRoot")

    var ldapConnection: LdapNetworkConnection = null
    try {
      ldapConnection = new LdapNetworkConnection(ldapConnectionConfig)
      ldapConnection.bind()
    } catch {
      case e: InvalidConnectionException  => return Left(e.toString)
      case e: LdapAuthenticationException  => return Left(e.toString)
      case e: LdapException  => return Left(e.toString)
    }

    var entry: Entry = null
    val filter = s"(cn=$username)"
    try {
      var entryCursor: EntryCursor = null
      entryCursor = ldapConnection.search(ldapUserRoot.getOrElse(""), filter, SearchScope.ONELEVEL, "*")
      entryCursor.next()
      entry = entryCursor.get();
    } catch {
      case e: CursorException => return Left(e.toString)
      case e: LdapException  => return Left(e.toString)
    }

    try {
      ldapConnection.close()
    } catch {
      case e: LdapException => return Left(e.toString)
      case e: IOException => return Left(e.toString)
    }

    Right(entry)
  }

  def getLdapConnectionConfig(username: String, password: String): Either[List[String], LdapConnectionConfig] = {
    val errors = ListBuffer[String]()
    val ldapConnectionConfig = new LdapConnectionConfig()

    val ldapHost = config.getOptional[String]("ldap.host")
    ldapHost match {
      case Some(value) => ldapConnectionConfig.setLdapHost(value)
      case _ => errors += "Could not load ldap host."
    }

    val ldapPort = config.getOptional[Int]("ldap.port")
    ldapPort match {
      case Some(value) if value > 0 => ldapConnectionConfig.setLdapPort(value)
      case _ => errors += "Could not load ldap port."
    }

    val ldapStartTls = config.getOptional[Boolean]("ldap.startTls")
    ldapStartTls match {
      case Some(value: Boolean) => ldapConnectionConfig.setUseTls(value)
      case _ => errors += "Could not load ldap useTls."
    }

    val ldapUseSsl = config.getOptional[Boolean]("ldap.useSsl")
    ldapUseSsl match {
      case Some(value: Boolean) => ldapConnectionConfig.setUseSsl(value)
      case _ => errors += "Could not load ldap useSsl."
    }

    val ldapUserRoot = config.getOptional[String]("ldap.userRoot")
    ldapUserRoot match {
      case Some(userRoot) =>
        val ldapName = config.getOptional[String]("ldap.name")
        ldapName match {
          case Some(ldapName) => ldapConnectionConfig.setName(ldapName
            .replace("%USER%", username)
            .replace("%USER_ROOT%", userRoot))
          case _ => errors += "Could not load ldap name."
        }
      case _ => errors += "Could not load ldap userRoot."
    }

    ldapConnectionConfig.setCredentials(password)

    errors match {
      case ListBuffer() => Right(ldapConnectionConfig)
      case _ => Left(errors.toList)
    }
  }
}
