package models

trait BaseProfile {
  def firstName: String
  def lastName: String
  def mail: String
  def employeeType: String
}

final case class Profile(id: Long = 0L, firstName: String, lastName: String, mail: String, employeeType: String) extends BaseProfile

final case class LdapProfile(firstName: String, lastName: String, mail: String, employeeType: String) extends BaseProfile