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

type Game struct {
	Fire     bool
	PlayerId int
	Players  *[]PlayerSocket
}

var games = map[string]Game{}

func (s *SocketServer) RealTimeServer(socketServer *socketio.Server) func(context echo.Context) error {
	return func(context echo.Context) error {
		gameUuid := context.QueryParam("gameUuid")
		gameData := s.gameModel.FindByUuid(gameUuid)

		if gameData.ID <= 0 {
			return context.JSON(http.StatusUnauthorized, map[string]string{
				"Error": "Invalid token",
			})
		}

		if games[gameUuid].PlayerId == 0 {
			games[gameUuid] = Game{
				PlayerId: gameData.PlayerId,
				Players:  &[]PlayerSocket{},
			}
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
			game := games[gameUuid]
			*game.Players = append(*game.Players, playerSocket)
			so.BroadcastTo(gameUuid, "new player", data)
			server.BroadcastTo(gameUuid, "total players", len(*game.Players))
		})

		so.On("send bullet", func(data interface{}) {
			if !games[gameUuid].Fire {
				return
			}
			server.BroadcastTo(gameUuid, "send bullet", data)
		})

		so.On("start game", func() {
			game := games[gameUuid]
			game.Fire = true
			server.BroadcastTo(gameUuid, "start game")
		})

		so.On("delete object", func(data interface{}) {
			server.BroadcastTo(gameUuid, "delete object", data)
		})

		so.On("stop player", func(data interface{}) {
			server.BroadcastTo(gameUuid, "stop player", data)
		})

		so.On("disconnection", func() {
			game := games[gameUuid]
			players := games[gameUuid].Players
			playersNoDead := []PlayerSocket{}
			for _, player := range *players {
				if player.socketId == so.Id() {
					server.BroadcastTo(gameUuid, "disconnection", player.data)
					continue
				}
				playersNoDead = append(playersNoDead, player)
			}
			*game.Players = playersNoDead
			server.BroadcastTo(gameUuid, "total players", len(*game.Players))

			if len(playersNoDead) == 1 {
				server.BroadcastTo(gameUuid, "win")
			}
		})

		players := games[gameUuid].Players
		for _, player := range *players {
			so.Emit("new player", player.data)
		}
	})
	return server
}
