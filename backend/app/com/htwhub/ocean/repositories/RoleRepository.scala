package com.htwhub.ocean.repositories

import com.htwhub.ocean.concurrent.DatabaseContexts.DbWriteOperationsContext
import com.htwhub.ocean.concurrent.DatabaseContexts.ExpensiveDbLookupsContext
import com.htwhub.ocean.concurrent.DatabaseContexts.SimpleDbLookupsContext
import com.htwhub.ocean.models.Instance
import com.htwhub.ocean.models.InstanceId
import com.htwhub.ocean.models.Role
import com.htwhub.ocean.models.RoleId
import javax.inject.Inject
import javax.inject.Singleton
import play.api.db.slick.DatabaseConfigProvider
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import slick.jdbc.JdbcProfile
import slick.lifted.ForeignKeyQuery

@Singleton
class RoleRepository @Inject() (dbConfigProvider: DatabaseConfigProvider, instanceRepository: InstanceRepository)(
  implicit ec: ExecutionContext
) {
  import dbConfig._
  import profile.api._

  val dbConfig = dbConfigProvider.get[JdbcProfile]

  class RoleTable(tag: Tag) extends Table[Role](tag, "roles") {

    def id = column[RoleId]("id", O.PrimaryKey, O.AutoInc)
    def instanceId = column[InstanceId]("instance_id")
    def name = column[String]("name")
    def password = column[String]("password")
    def * = (id, instanceId, name, password) <> ((Role.apply _).tupled, Role.unapply)
    def idx_instanceId_name = index("idx_instanceId_name", (instanceId, name), unique = true)
    def instance: ForeignKeyQuery[instanceRepository.InstanceTable, Instance] =
      foreignKey("fk_role_instance", instanceId, TableQuery[instanceRepository.InstanceTable])(
        _.id,
        onDelete = ForeignKeyAction.Cascade
      )
  }

  val roles = TableQuery[RoleTable]

  def getRolesByInstanceId(instanceId: InstanceId)(implicit
    expensiveDbLookupsContext: ExpensiveDbLookupsContext
  ): Future[Seq[Role]] =
    dbConfig.db.run(
      roles.filter(_.instanceId === instanceId).result
    )

  def getRolesByName(roleName: String)(implicit
    expensiveDbLookupsContext: ExpensiveDbLookupsContext
  ): Future[Seq[Role]] =
    dbConfig.db.run(
      roles.filter(_.name === roleName).result
    )

  def getRoleById(roleId: RoleId)(implicit
    simpleDbLookupsContext: SimpleDbLookupsContext
  ): Future[Option[Role]] =
    dbConfig.db.run(
      roles.filter(_.id === roleId).result.headOption
    )

  def deleteRoleById(roleId: RoleId)(implicit dbWriteOperationsContext: DbWriteOperationsContext): Future[Int] =
    dbConfig.db.run(
      roles.filter(_.id === roleId).delete
    )

  def deleteRoleByInstanceId(instanceId: InstanceId)(implicit
    dbWriteOperationsContext: DbWriteOperationsContext
  ): Future[Int] =
    dbConfig.db.run(
      roles.filter(_.instanceId === instanceId).delete
    )
}
