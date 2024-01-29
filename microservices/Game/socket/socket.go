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

type PlayerSocket struct {
	socketId string
	data     interface{}
}

var playersByGame = map[string][]PlayerSocket{}

func (s *SocketServer) RealTimeServer(socketServer *socketio.Server) func(context echo.Context) error {
	return func(context echo.Context) error {
		gameUuid := context.QueryParam("gameUuid")
		game := s.gameModel.FindByUuid(gameUuid)
		if game.ID <= 0 {
			return context.JSON(http.StatusUnauthorized, map[string]string{
				"Error": "Invalid token",
			})
		}
		//s.playerApi.SetGame(game.ID)
		socketServer.ServeHTTP(context.Response(), context.Request())
		return nil
	}
}

func (s *SocketServer) LoadServerSocket() *socketio.Server {
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal("error establishing new socketio server")
		return server
	}
	server.On("connection", func(so socketio.Socket) {
		gameUuid := so.Request().URL.Query().Get(("gameUuid"))

		so.Join(gameUuid)

		so.On("move user", func(data interface{}) {
			server.BroadcastTo(gameUuid, "move user", data)
		})

		so.On("user collision", func(data interface{}) {
			so.BroadcastTo(gameUuid, "user collision", data)
		})

		so.On("new player", func(data interface{}) {
			playerSocket := PlayerSocket{
				so.Id(),
				data,
			}
			playersByGame[gameUuid] = append(playersByGame[gameUuid], playerSocket)
			so.BroadcastTo(gameUuid, "new player", data)
		})

		so.On("send bullet", func(data interface{}) {
			server.BroadcastTo(gameUuid, "send bullet", data)
		})

		so.On("delete object", func(data interface{}) {
			server.BroadcastTo(gameUuid, "delete object", data)
		})

		so.On("stop player", func(data interface{}) {
			server.BroadcastTo(gameUuid, "stop player", data)
		})

		so.On("disconnection", func() {
			players := playersByGame[gameUuid]
			playersNoDead := []PlayerSocket{}
			for _, player := range players {
				if player.socketId == so.Id() {
					server.BroadcastTo(gameUuid, "disconnection", player.data)
					continue
				}
				playersNoDead = append(playersNoDead, player)
			}
			playersByGame[gameUuid] = playersNoDead

			if len(playersNoDead) == 1 {
				server.BroadcastTo(gameUuid, "win")
			}
		})

		players := playersByGame[gameUuid]
		for _, player := range players {
			so.Emit("new player", player.data)
		}
	})
	return server
}
