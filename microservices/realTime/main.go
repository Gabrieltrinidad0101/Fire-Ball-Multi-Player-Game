package main

import (
	"log"

	socketio "github.com/googollee/go-socket.io"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal("error establishing new socketio server")
		return
	}

	server.On("connection", func(so socketio.Socket) {
		so.Join("mychat")

		so.On("move user", func(data interface{}) {
			server.BroadcastTo("mychat", "move user", data)
		})

		so.On("user collision", func(data interface{}) {
			so.BroadcastTo("mychat", "user collision", data)
		})

		so.On("new user", func(data interface{}) {
			so.BroadcastTo("mychat", "new user", data)
		})

		so.On("send bullet", func(data interface{}) {
			server.BroadcastTo("mychat", "send bullet", data)
		})

		so.On("delete object", func(data interface{}) {
			server.BroadcastTo("mychat", "delete object", data)
		})

	})

	e := echo.New()
	e.HideBanner = true
	e.Use(middleware.CORS())
	e.Any("/socket.io/", func(context echo.Context) error {
		server.ServeHTTP(context.Response(), context.Request())
		return nil
	})
	e.Start(":5001")
}
