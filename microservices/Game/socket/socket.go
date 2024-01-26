package socket

import (
	"log"
	"net/http"
	"realTime/services"

	socketio "github.com/googollee/go-socket.io"
	"github.com/labstack/echo"
)

type GameModel interface {
	FindByUuid(string) *services.Game
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

var playersByGame = map[string][]interface{}{}

func (s *SocketServer) RealTimeServer(context echo.Context) error {
	// gameUuid := context.QueryParam("gameUuid")
	// game := s.gameModel.FindByUuid(gameUuid)
	// if game.ID <= 0 {
	// 	return context.JSON(http.StatusUnauthorized, map[string]string{
	// 		"Error": "Invalid token",
	// 	})
	// }
	//s.playerApi.SetGame(game.ID)
	s.serverSocket("myChat", context.Response(), context.Request())
	return nil
}

func (s *SocketServer) serverSocket(gameIdString string, w http.ResponseWriter, r *http.Request) {
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal("error establishing new socketio server")
		return
	}
	server.On("connection", func(so socketio.Socket) {

		so.Join(gameIdString)

		so.On("move user", func(data interface{}) {
			server.BroadcastTo(gameIdString, "move user", data)
		})

		so.On("user collision", func(data interface{}) {
			so.BroadcastTo(gameIdString, "user collision", data)
		})

		so.On("new user", func(data interface{}) {
			playersByGame[gameIdString] = append(playersByGame[gameIdString], data)
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

		players := playersByGame[gameIdString]
		for _, player := range players {
			so.Emit("new user", player)
		}
	})

	server.ServeHTTP(w, r)
}
