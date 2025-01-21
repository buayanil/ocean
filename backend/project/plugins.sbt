logLevel := Level.Warn

resolvers += "Typesafe repository" at "https://repo.typesafe.com/typesafe/releases/"

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.9.6")
addSbtPlugin("com.github.dwickern" % "sbt-swagger-play" % "0.5.0")
addSbtPlugin("org.scalameta" % "sbt-scalafmt" % "2.4.3")
addSbtPlugin("org.scoverage" % "sbt-scoverage" % "1.9.2")
