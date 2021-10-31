package models

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import java.sql.Timestamp
import play.api.libs.json.Json
import play.api.libs.json.OWrites
import scala.annotation.meta.field

@ApiModel("Database")
final case class Instance(
  @(ApiModelProperty @field) id: Long = 0,
  @(ApiModelProperty @field) userId: Long,
  @(ApiModelProperty @field) name: String,
  @(ApiModelProperty @field) engine: String,
  @(ApiModelProperty @field) createdAt: Timestamp
)

object Instance {
  implicit val InstanceWrites: OWrites[Instance] = Json.writes[Instance]

  val ENGINE_TYPE_POSTGRESQL = "P"
  val ENGINE_TYPE_MONGODB = "M"
  val ENGINE_ALLOWED = List(ENGINE_TYPE_POSTGRESQL, ENGINE_TYPE_MONGODB)
}
