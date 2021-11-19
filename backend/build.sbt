name := "backend"

version := "1.0"

maintainer := "https://github.com/abteilung6"

lazy val `backend` = (project in file(".")).enablePlugins(PlayScala)

resolvers += "Akka Snapshot Repository".at("https://repo.akka.io/snapshots/")

scalaVersion := "2.13.5"

libraryDependencies ++= Seq(
  specs2 % Test,
  guice,
  "org.scalatest" %% "scalatest" % "3.0.8" % Test,
  "org.mockito" % "mockito-core" % "3.12.4" % Test,
  "org.apache.directory.api" % "api-all" % "2.0.2",
  "com.typesafe.play" %% "play-slick" % "5.0.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "5.0.0",
  "com.h2database" % "h2" % "1.4.200",
  "org.postgresql" % "postgresql" % "42.2.21",
  "com.github.jwt-scala" %% "jwt-play-json" % "8.0.2",
  "com.github.jwt-scala" %% "jwt-core" % "8.0.2",
  "net.logstash.logback" % "logstash-logback-encoder" % "6.6",
  "com.fasterxml.jackson.module" %% "jackson-module-scala" % "2.12.2",
  "org.mongodb.scala" %% "mongo-scala-driver" % "2.9.0",
  // see https://github.com/swagger-api/swagger-play/pull/220
  "com.github.dwickern" %% "swagger-play2.8" % "3.1.0",
  "io.swagger" % "swagger-core" % "1.6.2",
  "com.fasterxml.jackson.module" %% "jackson-module-scala" % "2.11.1",
  "org.webjars" % "swagger-ui" % "3.52.5",
)

coverageEnabled in Test := true

addCommandAlias("format", "scalafmt; test:scalafmt")
addCommandAlias("formatCheck", "scalafmtCheck; test:scalafmtCheck")
addCommandAlias("cov", "clean; coverage; test; coverageReport;")
