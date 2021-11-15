package com.htwhub.ocean.controllers

import com.htwhub.ocean.actions.UserAction
import com.htwhub.ocean.actions.UserRequest
import com.htwhub.ocean.managers.DatabaseManager
import com.htwhub.ocean.managers.DatabaseManager.Exceptions.DatabaseManagerException
import com.htwhub.ocean.models.InstanceId
import com.htwhub.ocean.serializers.database.CreateDatabaseRequest
import com.htwhub.ocean.serializers.database.CreateDatabaseSerializer
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

class DatabaseController @Inject() (cc: ControllerComponents, userAction: UserAction, databaseManager: DatabaseManager)(
  implicit executionContext: ExecutionContext
) extends AbstractController(cc) {

  val logger: Logger = Logger(this.getClass)

  implicit val messages: Messages = messagesApi.preferred(Seq(Lang.defaultLang))

  def getDatabases: Action[AnyContent] = userAction.async { implicit request: UserRequest[AnyContent] =>
    databaseManager
      .getUserInstances(request.user)
      .map(instances => Ok(Json.toJson(instances)))
      .recoverWith { case e: DatabaseManagerException => exceptionToResult(e) }
  }

  def getDatabaseById(id: Long): Action[AnyContent] = userAction.async { implicit request: UserRequest[AnyContent] =>
    databaseManager
      .getUserInstanceById(InstanceId(id), request.user)
      .map(instance => Ok(Json.toJson(instance)))
      .recoverWith { case e: DatabaseManagerException => exceptionToResult(e) }
  }

  def addDatabase(): Action[AnyContent] = userAction.async { implicit request: UserRequest[AnyContent] =>
    processCreateDatabaseRequest()
  }

  def processCreateDatabaseRequest[A]()(implicit request: UserRequest[A]): Future[Result] = {

    def failure(badForm: Form[CreateDatabaseRequest]): Future[Result] =
      Future.successful(BadRequest(badForm.errorsAsJson))

    def success(createDatabaseRequest: CreateDatabaseRequest): Future[Result] =
      databaseManager
        .addDatabase(createDatabaseRequest, request.user)
        .map(response => Ok(Json.toJson(response)))
        .recoverWith { case e: DatabaseManagerException => exceptionToResult(e) }

    CreateDatabaseSerializer.constraints.bindFromRequest().fold(failure, success)
  }

  def exceptionToResult(e: DatabaseManagerException): Future[Result] = e match {
    case _: DatabaseManager.Exceptions.NotFound      => Future.successful(NotFound(e.getMessage))
    case _: DatabaseManager.Exceptions.AccessDenied  => Future.successful(Forbidden(e.getMessage))
    case _: DatabaseManager.Exceptions.InternalError => Future.successful(BadRequest(e.getMessage))
  }
}
