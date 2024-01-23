package socket

import (
	"log"
	"net/http"
	"realTime/services"
	"strconv"

	socketio "github.com/googollee/go-socket.io"
	"github.com/labstack/echo"
)

type GameModel interface {
	FindById(int) services.Game
}

type PlayerApi interface {
	setGame(int)
}

type SockerServer struct {
	gameModel GameModel
	playerApi PlayerApi
}

func (s *SockerServer) RealTimeServer() (func(context echo.Context) error, error) {
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal("error establishing new socketio server")
		return nil, err
	}

	server.On("connection", func(so socketio.Socket) {
		gameIdString := so.Request().Header.Get("gameId")
		gameId, err := strconv.Atoi(gameIdString)
		if err != nil {
			return
		}
		game := s.gameModel.FindById(gameId)
		if game.ID <= 0 {
			so.Emit(so.Id(), "Error in the Game ID")
			return
		}

		s.playerApi.setGame(gameId)

		so.Join(gameIdString)
		so.On("move user", func(data interface{}) {
			server.BroadcastTo(gameIdString, "move user", data)
		})

		so.On("user collision", func(data interface{}) {
			so.BroadcastTo(gameIdString, "user collision", data)
		})

		so.On("new user", func(data interface{}) {
			so.BroadcastTo(gameIdString, "new user", data)
		})

		so.On("send bullet", func(data interface{}) {
			server.BroadcastTo(gameIdString, "send bullet", data)
		})

		so.On("delete object", func(data interface{}) {
			server.BroadcastTo(gameIdString, "delete object", data)
		})

		so.On("stop player", func(data interface{}) {
			server.BroadcastTo(gameIdString, "stop player", data)
		})
	})

	return func(context echo.Context) error {
		gameIdString := context.Request().Header.Get("gameId")
		gameId, err := strconv.Atoi(gameIdString)
		if err != nil {
			return context.JSON(http.StatusUnauthorized, map[string]string{
				"Error": "Invalid token",
			})
		}
		game := s.gameModel.FindById(gameId)
		if game.ID <= 0 {
			return context.JSON(http.StatusUnauthorized, map[string]string{
				"Error": "Invalid token",
			})
		}
		server.ServeHTTP(context.Response(), context.Request())
		return nil
	}, nil
}
