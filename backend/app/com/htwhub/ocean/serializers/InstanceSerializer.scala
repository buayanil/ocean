package com.htwhub.ocean.serializers

import com.htwhub.ocean.models.Instance.EngineType

case class CreateInstanceFormData(name: String, engine: EngineType)

object InstanceSerializer {}
