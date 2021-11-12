package com.htwhub.ocean.serializers

import com.htwhub.ocean.models.InstanceId

case class CreateRoleFormData(instanceId: InstanceId, roleName: String)

object RoleSerializer {}
