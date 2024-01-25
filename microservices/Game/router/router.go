package router

import (
	"realTime/conf"
	"realTime/middleware"

	"github.com/labstack/echo"
)

func Init(e *echo.Echo) {
	configuration := conf.Init()
	gameController := configuration.GameController()
	socket := configuration.SocketController()
	socketController, err := socket.RealTimeServer()
	if err != nil {
		panic(err)
	}
	e.HideBanner = true
	e.GET("/socket.io/", socketController)

	game := e.Group("/game")
	game.GET("/findAll", gameController.FindAll, middleware.Auth)
	game.POST("/new", gameController.New, middleware.Auth)
	game.POST("/start", gameController.Start, middleware.Auth)
	game.POST("/newplayer", gameController.NewPlayer, middleware.Auth)
}
