package router

import (
	"realTime/conf"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func Init(e *echo.Echo) {
	configuration := conf.Init()
	gameController := configuration.GameController()
	e.Use(middleware.CORS())
	game := e.Group("/game")
	game.POST("/new", gameController.New)
	game.POST("/start", gameController.Start)
	game.POST("/newplayer", gameController.NewPlayer)
}
