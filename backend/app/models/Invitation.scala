package models

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import java.sql.Timestamp
import play.api.libs.json.Json
import play.api.libs.json.OWrites
import scala.annotation.meta.field

@ApiModel("Invitation")
final case class Invitation(
  @(ApiModelProperty @field) id: Long = 0,
  @(ApiModelProperty @field) instanceId: Long,
  @(ApiModelProperty @field) userId: Long,
  @(ApiModelProperty @field) createdAt: Timestamp
)

@ApiModel("Invitation")
object Invitation {
  implicit val InvitationWrites: OWrites[Invitation] = Json.writes[Invitation]
}
