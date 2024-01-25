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
	FindById(uint) *services.Game
}

type PlayerApi interface {
	SetGame(uint)
}

type SocketServer struct {
	gameModel GameModel
	playerApi PlayerApi
}

func NewSocketServer(gameModel GameModel, playerApi PlayerApi) *SocketServer {
	return &SocketServer{
		gameModel,
		playerApi,
	}
}

func (s *SocketServer) RealTimeServer() (func(context echo.Context) error, error) {
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal("error establishing new socketio server")
		return nil, err
	}

	server.On("connection", func(so socketio.Socket) {
		gameIdString := so.Request().Context().Value("gameId").(string)

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
		gameIdString := context.QueryParam("gameId")
		gameId, err := strconv.Atoi(gameIdString)
		if err != nil {
			return context.JSON(http.StatusUnauthorized, map[string]string{
				"Error": "Invalid token",
			})
		}
		game := s.gameModel.FindById(uint(gameId))
		if game.ID <= 0 {
			return context.JSON(http.StatusUnauthorized, map[string]string{
				"Error": "Invalid token",
			})
		}
		s.playerApi.SetGame(uint(gameId))
		context.Set("gameId", gameIdString)
		server.ServeHTTP(context.Response(), context.Request())
		return nil
	}, nil
}
