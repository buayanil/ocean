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

@ApiModel("Instance")
final case class Instance(
  @(ApiModelProperty @field) id: InstanceId,
  @(ApiModelProperty @field) userId: UserId,
  @(ApiModelProperty @field) name: String,
  @(ApiModelProperty @field) engine: String,
  @(ApiModelProperty @field) createdAt: Timestamp
)

object Instance {
  implicit lazy val instanceFormat: OFormat[Instance] = Json.format[Instance]
}

final case class InstanceId(value: Long) extends MappedTo[Long]

object InstanceId {
  implicit lazy val instanceIdFormat: Format[InstanceId] = implicitly[Format[Long]].inmap(InstanceId.apply, _.value)
}
