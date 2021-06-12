name := "backend"
 
version := "1.0" 
      
lazy val `backend` = (project in file(".")).enablePlugins(PlayScala)

resolvers += "Akka Snapshot Repository" at "https://repo.akka.io/snapshots/"
      
scalaVersion := "2.13.5"

libraryDependencies ++= Seq(
  specs2 % Test,
  guice,
  "org.apache.directory.api" % "api-all" % "2.0.2",
)
