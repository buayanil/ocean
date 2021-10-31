package services

import javax.inject.Inject
import models.ErrorMessage
import play.api.Configuration
import play.api.Logger
import repositories.cluster.PgClusterRepository
import scala.concurrent.duration.Duration
import scala.concurrent.Await
import scala.util.Failure
import scala.util.Success

class StartupService @Inject() (config: Configuration, pgClusterRepository: PgClusterRepository) {

  val logger: Logger = Logger(this.getClass)
  runInternal()

  def runInternal(): Unit = {
    checkForLdapRole()
    checkForGenericRole()
  }

  def checkForLdapRole(): Unit =
    config.getOptional[String]("ldap_role") match {
      case None =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_STARTUP_LDAP_ROLE_CONFIG_MISSING,
          ErrorMessage.MESSAGE_STARTUP_LDAP_ROLE_CONFIG_MISSING
        )
        logger.error(errorMessage.toString)
      case Some(ldapRole) =>
        Await.result(pgClusterRepository.existsRole(ldapRole), Duration.Inf) match {
          case Failure(throwable) =>
            val errorMessage = ErrorMessage(
              ErrorMessage.CODE_STARTUP_LDAP_ROLE_EXIST_FAILED,
              ErrorMessage.MESSAGE_STARTUP_LDAP_ROLE_EXIST_FAILED,
              developerMessage = throwable.getMessage
            )
            logger.error(errorMessage.toString)
          case Success(value) if value.isEmpty =>
            val warnMessage = ErrorMessage(
              ErrorMessage.CODE_STARTUP_LDAP_ROLE_NOT_EXISTS,
              ErrorMessage.MESSAGE_STARTUP_LDAP_ROLE_NOT_EXISTS,
            )
            logger.warn(warnMessage.toString)
            Await.result(pgClusterRepository.createGroup(ldapRole), Duration.Inf) match {
              case Failure(createGroupThrowable) =>
                val errorMessage = ErrorMessage(
                  ErrorMessage.CODE_STARTUP_LDAP_ROLE_CREATE_FAILED,
                  ErrorMessage.MESSAGE_STARTUP_LDAP_ROLE_CREATE_FAILED,
                  developerMessage = createGroupThrowable.getMessage
                )
                logger.error(errorMessage.toString)
              case Success(value) =>
                logger.info(f"New ldap role ${ldapRole} created.")
            }
          case Success(_) =>
            logger.info(f"Ldap role ${ldapRole} exists. No action needed.")
        }
    }

  def checkForGenericRole(): Unit =
    config.getOptional[String]("generic_role") match {
      case None =>
        val errorMessage = ErrorMessage(
          ErrorMessage.CODE_STARTUP_GENERIC_ROLE_CONFIG_MISSING,
          ErrorMessage.MESSAGE_STARTUP_GENERIC_ROLE_CONFIG_MISSING
        )
        logger.error(errorMessage.toString)
      case Some(genericRole) =>
        Await.result(pgClusterRepository.existsRole(genericRole), Duration.Inf) match {
          case Failure(throwable) =>
            val errorMessage = ErrorMessage(
              ErrorMessage.CODE_STARTUP_GENERIC_ROLE_EXIST_FAILED,
              ErrorMessage.MESSAGE_STARTUP_GENERIC_ROLE_EXIST_FAILED,
              developerMessage = throwable.getMessage
            )
            logger.error(errorMessage.toString)
          case Success(value) if value.isEmpty =>
            val warnMessage = ErrorMessage(
              ErrorMessage.CODE_STARTUP_GENERIC_ROLE_NOT_EXISTS,
              ErrorMessage.MESSAGE_STARTUP_GENERIC_ROLE_NOT_EXISTS,
            )
            logger.warn(warnMessage.toString)
            Await.result(pgClusterRepository.createGroup(genericRole), Duration.Inf) match {
              case Failure(createGroupThrowable) =>
                val errorMessage = ErrorMessage(
                  ErrorMessage.CODE_STARTUP_GENERIC_ROLE_CREATE_FAILED,
                  ErrorMessage.MESSAGE_STARTUP_GENERIC_ROLE_CREATE_FAILED,
                  developerMessage = createGroupThrowable.getMessage
                )
                logger.error(errorMessage.toString)
              case Success(value) =>
                logger.info(f"New generic role ${genericRole} created.")
            }
          case Success(_) =>
            logger.info(f"Generic role ${genericRole} exists. No action needed.")
        }
    }
}
