package models

import play.api.libs.json.{Json, OWrites}


case class ErrorMessage(code: String, message: String, developerMessage: String = "")

object ErrorMessage {
  implicit val errorMessageWrites: OWrites[ErrorMessage] = Json.writes[ErrorMessage]

  // JWT
  val CODE_JWT_BEARER_MISSING = "jwt/bearer-missing"
  val CODE_JWT_ISSUER_MISSING = "jwt/issuer-missing"
  val CODE_JWT_INVALID_SIGNATURE = "jwt/invalid-signature"
  val CODE_JWT_INVALID_ISSUER = "jwt/invalid-issuer"

  val MESSAGE_JWT_ISSUER_MISSING = "Issuer in JWT required."
  val MESSAGE_JWT_INVALID_SIGNATURE = "JWT has a invalid signature."

  // Code LDAP
  val CODE_LDAP_CONNECTION_CONFIG = "ldap/connection-config"
  val CODE_LDAP_ENTRY_MISSING = "ldap/entry-missing"
  val CODE_LDAP_CURSOR_FAILED = "ldap/cursor-failed"
  val CODE_LDAP_AUTHENTICATION_FAILED = "ldap/authentication-failed"
  val CODE_LDAP_CLOSING_FAILED = "ldap/closing-failed"

  val MESSAGE_LDAP_ENTRY_MISSING = "Your account could not loaded. Please contact the support."
  val MESSAGE_LDAP_AUTHENTICATION_FAILED = "An account with this profile was not found."
  val MESSAGE_LDAP_CONNECTION_CONFIG = "The authentication service cannot load its internal configuration."

  // Instance
  val CODE_INSTANCE_LIST_FAILED = "database/list-failed"
  val CODE_INSTANCE_GET_FAILED = "database/get-failed"
  val CODE_INSTANCE_GET_CONSTRAINT_ERROR = "database/get-constraint-error"
  val CODE_INSTANCE_CREATE_FAILED = "database/create-failed"
  val CODE_INSTANCE_CREATE_DUPLICATED = "database/create-duplicated"
  val CODE_INSTANCE_EXISTS_FAILED = "database/exists-failed"
  val CODE_INSTANCE_DELETE_FAILED = "database/delete-failed"
  val CODE_INSTANCE_DELETE_NOT_FOUND = "database/delete-not-found"
  val CODE_INSTANCE_DELETE_CONSTRAINT_ERROR = "database/delete-constraint-error"

  val MESSAGE_INSTANCE_LIST_FAILED = "Could not get the instance list."
  val MESSAGE_INSTANCE_GET_FAILED = "Could not get the instance."
  val MESSAGE_INSTANCE_GET_CONSTRAINT_ERROR = "Could not identify the instance."
  val MESSAGE_INSTANCE_CREATE_FAILED = "Could not create a database."
  val MESSAGE_INSTANCE_CREATE_DUPLICATED = "Database name is already reserved."
  val MESSAGE_INSTANCE_EXISTS_FAILED = "Could not check for this database."
  val MESSAGE_INSTANCE_DELETE_FAILED = "Could not delete this database."
  val MESSAGE_INSTANCE_DELETE_NOT_FOUND = "Could not delete this database. Database Does not exists."
  val MESSAGE_INSTANCE_DELETE_CONSTRAINT_ERROR = "Could not delete this database."

  // Role
  val CODE_ROLE_LIST_FAILED = "role/list-failed"
  val CODE_ROLE_GET_FAILED = "role/get-failed"
  val CODE_ROLE_CREATE_FAILED = "role/create-failed"
  val CODE_ROLE_CREATE_WRONG_PERMISSION = "role/create-wrong-permission"
  val CODE_ROLE_CREATE_CONSTRAINT_ERROR = "role/create-constraint-error"
  val CODE_ROLE_CREATE_INVALID_NAME = "role/invalid-name"
  val CODE_ROLE_LIST_WRONG_PERMISSION = "role/list-wrong-permission"
  val CODE_ROLE_EXISTS_WRONG_PERMISSION = "role/exist-wrong-permission"
  val CODE_ROLE_EXISTS_FAILED = "role/exist-failed"
  val CODE_ROLE_DELETE_FAILED = "role/delete-failed"
  val CODE_ROLE_DELETE_WRONG_PERMISSION = "role/delete-wrong-permission"

  val MESSAGE_ROLE_FAILED = "Could not get the role list."
  val MESSAGE_ROLE_GET_FAILED = "Could not get the database role."
  val MESSAGE_ROLE_CREATE_FAILED = "Could not create a role."
  val MESSAGE_ROLE_CREATE_WRONG_PERMISSION = "Only the owner can create a role."
  val MESSAGE_ROLE_CREATE_CONSTRAINT_ERROR = "Role already exists."
  val MESSAGE_ROLE_CREATE_INVALID_NAME = "Role name should start with database name as prefix"
  val MESSAGE_ROLE_LIST_WRONG_PERMISSION = "Only the owner can view the roles."
  val MESSAGE_ROLE_EXISTS_WRONG_PERMISSION = "Only the owner can check the roles."
  val MESSAGE_ROLE_EXISTS_FAILED = "Could not check for the database role."
  val MESSAGE_ROLE_DELETE_FAILED = "Could not delete the database role."
  val MESSAGE_ROLE_DELETE_WRONG_PERMISSION = "Only the owner can delete a role."

  // Postgres Cluster
  val CODE_PG_CLUSTER_CREATED_DATABASE_EXIST = "pg_cluster/create-database-failed-exists"
  val CODE_PG_CLUSTER_CREATED_DATABASE_NOT_AVAILABLE = "pg_cluster/create-database-not-available"
  val CODE_PG_CLUSTER_CREATED_DATABASE_UNKNOWN = "pg_cluster/create-database-failed-unknown"
  val CODE_PG_CLUSTER_CREATED_ROLE_EXIST = "pg_cluster/create-role-exists"
  val CODE_PG_CLUSTER_CREATED_ROLE_UNKNOWN = "pg_cluster/create-role-failed-unknown"
  val CODE_PG_CLUSTER_DELETED_ROLE_FAILED = "pg_cluster/delete-role-failed"

  val MESSAGE_PG_CLUSTER_CREATED_DATABASE_EXIST = "Could not create the database. Database already exists."
  val MESSAGE_PG_CLUSTER_CREATED_DATABASE_NOT_AVAILABLE = "Could not create the database. Cluster is not available."
  val MESSAGE_PG_CLUSTER_CREATED_DATABASE_UNKNOWN = "Could not create the database. Unknown error."
  val MESSAGE_PG_CLUSTER_CREATED_ROLE_EXIST = "Could not create the role. Role already exists."
  val MESSAGE_PG_CLUSTER_CREATED_ROLE_UNKNOWN = "Could not create the role. Unknown error."
  val MESSAGE_PG_CLUSTER_DELETE_DATABASE_FAILED = "Could not delete the role."

  // Startup
  val CODE_STARTUP_LDAP_ROLE_CONFIG_MISSING = "startup/ldap-role-config-missing"
  val CODE_STARTUP_LDAP_ROLE_EXIST_FAILED = "startup/ldap-role-exists-failed"
  val CODE_STARTUP_LDAP_ROLE_NOT_EXISTS = "startup/ldap-role-not-exists"
  val CODE_STARTUP_LDAP_ROLE_CREATE_FAILED = "startup/ldap-role-create-failed"
  val CODE_STARTUP_GENERIC_ROLE_CONFIG_MISSING = "startup/generic-role-config-missing"
  val CODE_STARTUP_GENERIC_ROLE_EXIST_FAILED = "startup/generic-role-exists-failed"
  val CODE_STARTUP_GENERIC_ROLE_NOT_EXISTS = "startup/generic-role-not-exists"
  val CODE_STARTUP_GENERIC_ROLE_CREATE_FAILED = "startup/generic-role-create-failed"

  val MESSAGE_STARTUP_LDAP_ROLE_CONFIG_MISSING = "Could not load ldap role from configuration."
  val MESSAGE_STARTUP_LDAP_ROLE_EXIST_FAILED = "Could not check if ldap role exists."
  val MESSAGE_STARTUP_LDAP_ROLE_NOT_EXISTS = "Ldap role does not exists."
  val MESSAGE_STARTUP_LDAP_ROLE_CREATE_FAILED = "Could not create ldap role."
  val MESSAGE_STARTUP_GENERIC_ROLE_CONFIG_MISSING = "Could not load ldap role from configuration."
  val MESSAGE_STARTUP_GENERIC_ROLE_EXIST_FAILED = "Could not check if generic role exists."
  val MESSAGE_STARTUP_GENERIC_ROLE_NOT_EXISTS = "Generic role does not exists."
  val MESSAGE_STARTUP_GENERIC_ROLE_CREATE_FAILED = "Could not create generic role."
}

