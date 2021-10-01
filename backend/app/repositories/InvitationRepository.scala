package repositories

import java.sql.Timestamp
import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try
import slick.jdbc.JdbcProfile
import slick.sql.SqlProfile.ColumnOption.SqlType

import models.Invitation


@Singleton
class InvitationRepository @Inject()(dbConfigProvider: DatabaseConfigProvider, instanceRepository: InstanceRepository, userRepository: UserRepository)(implicit ec: ExecutionContext) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig._
  import profile.api._

  class InvitationTable(tag: Tag) extends Table[Invitation](tag, "invitations") {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

    def instanceId = column[Long]("instance_id")

    def userId = column[Long]("user_id")

    def createdAt = column[Timestamp]("created_at", SqlType("timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP"))

    def * =
      (id, instanceId, userId, createdAt) <> ((Invitation.apply _).tupled, Invitation.unapply)

    foreignKey("instances", instanceId, instanceRepository.instances)(_.id, onDelete = ForeignKeyAction.SetNull)

    foreignKey("users", instanceId, userRepository.users)(_.id, onDelete = ForeignKeyAction.SetNull)

    def idx = index("idx_instanceId_user_id", (instanceId, userId), unique = true)
  }

  val invitations = TableQuery[InvitationTable]

  def getAllForInstance(instanceId: Long): Future[Try[Seq[Invitation]]] = {
    val action = invitations.filter(invitation => invitation.instanceId === instanceId).result.asTry
    dbConfig.db.run(action)
  }

  def getInvitation(invitationId: Long): Future[Try[Seq[Invitation]]] = {
    val action = invitations.filter(invitation => invitation.id === invitationId).result.asTry
    dbConfig.db.run(action)
  }

  def addInvitation(invitation: Invitation): Future[Try[Invitation]] = {
    val insertQuery = invitations returning invitations.map(_.id) into ((item, id) => item.copy(id = id))
    val action = (insertQuery += invitation).asTry
    dbConfig.db.run(action)
  }

  def deleteInvitation(invitationId: Long): Future[Try[Int]] = {
    val action = invitations.filter(_.id === invitationId).delete.asTry
    dbConfig.db.run(action)
  }

  def deleteDatabaseInvitations(instanceId: Long): Future[Try[Int]] = {
    val deleteDatabaseInvitationsStatement = invitations.filter(_.instanceId === instanceId).delete.asTry
    dbConfig.db.run(deleteDatabaseInvitationsStatement)
  }
}