package controllers

import javax.inject.Inject
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import play.api.data.FormError
import play.api.libs.json.{JsValue, Json, Writes}
import play.api.Logger

import actions.{UserAction, UserRequest}
import forms.{CreateRoleForm, RoleExistsForm}
import models.{ErrorResponse, ExistsRoleResponse, RoleDeletedResponse}
import services.{DatabaseManagerService, RoleManagerService, RoleService}


class RoleController @Inject()(cc: ControllerComponents,
                               userAction: UserAction,
                               roleService: RoleService,
                               databaseManagerService: DatabaseManagerService,
                               roleManagerService: RoleManagerService) extends AbstractController(cc) {

  val logger: Logger = Logger(this.getClass)

  implicit object FormErrorWrites extends Writes[FormError] {
    override def writes(o: FormError): JsValue = Json.obj(
      "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(o.message)
    )
  }

  def listInstanceRoles(instanceId: Long): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    roleService.listInstanceRoles(instanceId, request.user) match {
      case Left(error) =>
        logger.error(error.toString)
        BadRequest(Json.toJson(ErrorResponse(List(error))))
      case Right(roles) => Ok(Json.toJson(roles))
    }
  }

  def addRole(): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    CreateRoleForm.form.bindFromRequest.fold(
      formWithErrors => {
        logger.warn(formWithErrors.errors.toString)
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      createRoleFormData => {
        roleManagerService.addRole(createRoleFormData, request.user) match {
          case Left(error) =>
            logger.error(error.toString)
            BadRequest(Json.toJson(ErrorResponse(error)))
          case Right(instance) => Ok(Json.toJson(instance))
        }
      }
    )
  }

  def existsRole(): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    RoleExistsForm.form.bindFromRequest.fold(
      formWithErrors => {
        logger.warn(formWithErrors.errors.toString)
        UnprocessableEntity(Json.toJson(formWithErrors.errors))
      },
      roleExistsFormData => {
        roleService.existsRole(roleExistsFormData, request.user) match {
          case Left(error) =>
            logger.error(error.toString)
            BadRequest(Json.toJson(ErrorResponse(List(error))))
          case Right(exists) =>
            Ok(Json.toJson(ExistsRoleResponse(exists)))
        }
      }
    )
  }

  def deleteRole(id: Long): Action[AnyContent] = userAction { implicit request: UserRequest[AnyContent] =>
    roleManagerService.deleteRole(id, request.user) match {
      case Left(error) =>
        logger.error(error.toString)
        BadRequest(Json.toJson(ErrorResponse(error)))
      case Right(rows) => Ok(Json.toJson((RoleDeletedResponse(rows))))
    }
  }
}