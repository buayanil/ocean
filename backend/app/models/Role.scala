package models

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import play.api.libs.json.Json
import play.api.libs.json.OWrites
import scala.annotation.meta.field

@ApiModel("Role")
final case class Role(
  @(ApiModelProperty @field) id: Long = 0,
  @(ApiModelProperty @field) instanceId: Long,
  @(ApiModelProperty @field) name: String,
  @(ApiModelProperty @field) password: String
)

object Role {
  implicit val InstanceWrites: OWrites[Role] = Json.writes[Role]
}
