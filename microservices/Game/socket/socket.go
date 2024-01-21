package socket

import (
	"fmt"
	"log"

	socketio "github.com/googollee/go-socket.io"
	"github.com/labstack/echo"
)

func RealTimeServer() (func(context echo.Context) error, error) {
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal("error establishing new socketio server")
		return nil, err
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

		so.On("stop player", func(data interface{}) {
			server.BroadcastTo("mychat", "stop player", data)
		})

	})

	return func(context echo.Context) error {
		fmt.Print()
		server.ServeHTTP(context.Response(), context.Request())
		return nil
	}, nil
}
