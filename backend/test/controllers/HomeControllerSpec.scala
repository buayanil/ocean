package controllers

import play.api.mvc._
import play.api.test._

import scala.concurrent.Future


class HomeControllerSpec extends PlaySpecification with Results {
  "HomeController#index" should {
    "return something" in {
      val controller = new HomeController(Helpers.stubControllerComponents())
      val result: Future[Result] = controller.index().apply(FakeRequest())
      val bodyText: String = contentAsString(result)
      (bodyText must be).equalTo("Ok")
    }
  }
}
