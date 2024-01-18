package router

import (
	"user/conf"
	"user/middleware"

	"github.com/labstack/echo/v4"
)

func Init(e *echo.Echo) {
	configuretion := conf.Init()
	playerController := configuretion.PlayerController()
	user := e.Group("/player")
	user.POST("/login", playerController.LoginController)
	user.POST("/register", playerController.RegisterController)
	user.GET("/playersByGame", playerController.PlayersByGameController, middleware.Auth)
	user.GET("/findAll", playerController.FindAllPlayersController, middleware.Auth)
}
