package router

import (
	"realTime/conf"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
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
	e.Use(middleware.CORS())
	e.GET("/socket.io/", socketController)

	game := e.Group("/game")
	game.GET("/findAll", gameController.FindAll)
	game.POST("/new", gameController.New)
	game.POST("/start", gameController.Start)
	game.POST("/newplayer", gameController.NewPlayer)
}
