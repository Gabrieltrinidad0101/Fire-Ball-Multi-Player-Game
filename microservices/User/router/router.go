package main

import (
	"user/conf"

	"github.com/labstack/echo/v4"
)

type Router struct{}

func (r *Router) Init(e *echo.Echo) {
	configuretion := conf.Config{}
	playerController := configuretion.PlayerController()
	user := e.Group("/player")
	user.POST("/login", playerController.LoginController)
	user.POST("/register", playerController.RegisterController)
	user.GET("/playersByGame", playerController.PlayersByGameController)
	user.GET("/findAll", playerController.FindAllPlayersController)
}
