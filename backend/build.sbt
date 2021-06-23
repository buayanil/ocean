name := "backend"
 
version := "1.0"

maintainer := "https://github.com/abteilung6"
      
lazy val `backend` = (project in file(".")).enablePlugins(PlayScala)

resolvers += "Akka Snapshot Repository" at "https://repo.akka.io/snapshots/"
      
scalaVersion := "2.13.5"

libraryDependencies ++= Seq(
  specs2 % Test,
  guice,
  "org.apache.directory.api" % "api-all" % "2.0.2",
  "com.typesafe.play" %% "play-slick" % "5.0.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "5.0.0",
  "com.h2database" % "h2" % "1.4.200",
  "org.postgresql" % "postgresql" % "42.2.21",
  "com.github.jwt-scala" %% "jwt-play-json" % "8.0.2",
  "com.github.jwt-scala" %% "jwt-core" % "8.0.2",
)
