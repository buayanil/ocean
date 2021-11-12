package com.htwhub.ocean.serializers

import com.htwhub.ocean.models.InstanceId
import com.htwhub.ocean.models.UserId

case class CreateInvitationFormData(instanceId: InstanceId, userId: UserId)

object InvitationSerializer {}
