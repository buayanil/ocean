package com.htwhub.ocean.controllers

import com.htwhub.ocean.actions.UserAction
import com.htwhub.ocean.actions.UserRequest
import com.htwhub.ocean.managers.RoleManager
import com.htwhub.ocean.managers.RoleManager.Exceptions.RoleManagerException
import com.htwhub.ocean.models.InstanceId
import com.htwhub.ocean.models.RoleId
import com.htwhub.ocean.serializers.role.AvailabilityRoleRequest
import com.htwhub.ocean.serializers.role.AvailabilityRoleResponse
import com.htwhub.ocean.serializers.role.AvailabilityRoleSerializer
import com.htwhub.ocean.serializers.role.CreateRoleRequest
import com.htwhub.ocean.serializers.role.CreateRoleSerializer
import javax.inject.Inject
import play.api.data.Form
import play.api.i18n.Lang
import play.api.i18n.Messages
import play.api.libs.json.Json
import play.api.mvc.AbstractController
import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.api.mvc.ControllerComponents
import play.api.mvc.Result
import play.api.Logger
import scala.concurrent.ExecutionContext
import scala.concurrent.Future

class RoleController @Inject() (cc: ControllerComponents, userAction: UserAction, roleManager: RoleManager)(implicit
  executionContext: ExecutionContext
) extends AbstractController(cc) {

  val logger: Logger = Logger(this.getClass)

  implicit val messages: Messages = messagesApi.preferred(Seq(Lang.defaultLang))

  def getRolesByInstanceId(instanceId: Long): Action[AnyContent] = userAction.async {
    implicit request: UserRequest[AnyContent] =>
      roleManager
        .getRolesByInstanceId(InstanceId(instanceId), request.user)
        .map(roles => Ok(Json.toJson(roles)))
        .recoverWith { case e: RoleManagerException => exceptionToResult(e) }
  }

  def getRoleAvailability: Action[AnyContent] = userAction.async { implicit request: UserRequest[AnyContent] =>
    processAvailabilityRoleRequest()
  }

  def processAvailabilityRoleRequest[A]()(implicit request: UserRequest[A]): Future[Result] = {

    def failure(badForm: Form[AvailabilityRoleRequest]): Future[Result] =
      Future.successful(BadRequest(badForm.errorsAsJson))

    def success(availableRoleRequest: AvailabilityRoleRequest): Future[Result] =
      roleManager
        .getRoleAvailability(availableRoleRequest)
        .map(response => Ok(Json.toJson(AvailabilityRoleResponse(response))))
        .recoverWith { case e: RoleManagerException => exceptionToResult(e) }

    AvailabilityRoleSerializer.constraints.bindFromRequest().fold(failure, success)
  }

  def addRole(): Action[AnyContent] = userAction.async { implicit request: UserRequest[AnyContent] =>
    processCreateRoleRequest()
  }

  def processCreateRoleRequest[A]()(implicit request: UserRequest[A]): Future[Result] = {

    def failure(badForm: Form[CreateRoleRequest]): Future[Result] =
      Future.successful(BadRequest(badForm.errorsAsJson))

    def success(createRoleRequest: CreateRoleRequest): Future[Result] =
      roleManager
        .addRole(createRoleRequest, request.user)
        .map(response => Ok(Json.toJson(response)))
        .recoverWith { case e: RoleManagerException => exceptionToResult(e) }

    CreateRoleSerializer.constraints.bindFromRequest().fold(failure, success)
  }

  def deleteRole(id: Long): Action[AnyContent] = userAction.async { implicit request: UserRequest[AnyContent] =>
    roleManager
      .deleteRoleById(RoleId(id), request.user)
      .map(_ => Ok(""))
      .recoverWith { case e: RoleManagerException => exceptionToResult(e) }
  }

  def exceptionToResult(e: RoleManagerException): Future[Result] = e match {
    case _: RoleManager.Exceptions.NotFound      => Future.successful(NotFound(e.getMessage))
    case _: RoleManager.Exceptions.AccessDenied  => Future.successful(Forbidden(e.getMessage))
    case _: RoleManager.Exceptions.InternalError => Future.successful(BadRequest(e.getMessage))
  }
}
