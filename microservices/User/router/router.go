package router

import (
	"user/conf"
	"user/middleware"

	"github.com/labstack/echo"
)

func Init(e *echo.Echo) {
	configuretion := conf.Init()
	playerController := configuretion.PlayerController()
	player := e.Group("/player")
	player.POST("/login", playerController.LoginController)
	player.POST("/register", playerController.RegisterController)
	player.GET("/playersByGame", playerController.PlayersByGameController, middleware.Auth)
	player.POST("/setGame", playerController.SetGame, middleware.Auth)
	player.POST("/playerWin", playerController.SetGame, middleware.MicroservicesAuth)
	player.GET("/findAll", playerController.FindAllPlayersController, middleware.Auth)
	player.GET("/getData", playerController.GetDataFromUser, middleware.Auth)
	player.GET("/winner", playerController.Winner, middleware.Auth)

}
