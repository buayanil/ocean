package com.htwhub.ocean.models

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import java.sql.Timestamp
import play.api.libs.functional.syntax.toInvariantFunctorOps
import play.api.libs.json.Format
import play.api.libs.json.Json
import play.api.libs.json.OFormat
import scala.annotation.meta.field
import slick.lifted.MappedTo

@ApiModel("Invitation")
final case class Invitation(
  @(ApiModelProperty @field) id: InvitationId,
  @(ApiModelProperty @field) instanceId: InstanceId,
  @(ApiModelProperty @field) userId: UserId,
  @(ApiModelProperty @field) createdAt: Timestamp
)

object Invitation {
  implicit lazy val invitationFormat: OFormat[Invitation] = Json.format[Invitation]
}

final case class InvitationId(value: Long) extends MappedTo[Long]

object InvitationId {
  implicit lazy val invitationIdFormat: Format[InvitationId] =
    implicitly[Format[Long]].inmap(InvitationId.apply, _.value)
}
