package socket

import (
	"fmt"
	"log"
	"net/http"
	"realTime/services"
	"strconv"

	socketio "github.com/googollee/go-socket.io"
	"github.com/labstack/echo"
)

type GameModel interface {
	FindByUuid(string) *services.Game
}

type PlayerApi interface {
	SetGame(uint, string)
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
	PlayerId int
	data     PlayerSocketData
}

type PlayerSocketData struct {
	X      float64 `json:"x"`
	Y      float64 `json:"y"`
	W      float64 `json:"w"`
	H      float64 `json:"h"`
	ImageW float64 `json:"imageW"`
	Image  string  `json:"image"`
	Id     string  `json:"id"`
}

type Game struct {
	Fire     bool
	PlayerId int
	Players  *[]PlayerSocket
}

var games = map[string]*Game{}

func (s *SocketServer) RealTimeServer(socketServer *socketio.Server) func(context echo.Context) error {
	return func(context echo.Context) error {
		gameUuid := context.QueryParam("gameUuid")
		gameData := s.gameModel.FindByUuid(gameUuid)

		if gameData.ID <= 0 {
			return context.JSON(http.StatusUnauthorized, map[string]string{
				"Error": "Invalid token",
			})
		}

		if games[gameUuid] == nil {
			games[gameUuid] = &Game{
				PlayerId: gameData.PlayerId,
				Players:  &[]PlayerSocket{},
			}
		}
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
		playerId, err := strconv.Atoi(so.Request().URL.Query().Get(("playerId")))
		if err != nil {
			fmt.Print(err)
		}
		game := games[gameUuid]

		if game.Fire {
			so.Emit("force disconnect", "force")
			so.Disconnect()
			return
		}

		//if the player has connect disconnect the older
		for _, player := range *game.Players {
			if player.PlayerId == playerId {
				so.BroadcastTo(gameUuid, "force disconnect", player.data.Id)
				break
			}
		}

		so.Join(gameUuid)
		s.playerApi.SetGame(uint(playerId), gameUuid)

		so.On("move user", func(data interface{}) {
			if !games[gameUuid].Fire {
				return
			}
			server.BroadcastTo(gameUuid, "move user", data)
		})

		so.On("user collision", func(data interface{}) {
			so.BroadcastTo(gameUuid, "user collision", data)
		})

		so.On("new player", func(data map[string]interface{}) {
			playerData := PlayerSocketData{
				X:      data["x"].(float64),
				Y:      data["y"].(float64),
				H:      data["h"].(float64),
				Image:  data["image"].(string),
				ImageW: data["imageW"].(float64),
				W:      data["w"].(float64),
				Id:     data["id"].(string),
			}
			playerSocket := PlayerSocket{
				so.Id(),
				playerId,
				playerData,
			}
			*game.Players = append(*game.Players, playerSocket)
			so.BroadcastTo(gameUuid, "new player", data)
			server.BroadcastTo(gameUuid, "total players", len(*game.Players))
		})

		so.On("send bullet", func(data interface{}) {
			if !game.Fire {
				return
			}
			server.BroadcastTo(gameUuid, "send bullet", data)
		})

		so.On("start game", func() {
			if len(*game.Players) <= 1 {
				return
			}
			game.Fire = true
			server.BroadcastTo(gameUuid, "start game")
		})

		so.On("delete object", func(data interface{}) {
			server.BroadcastTo(gameUuid, "delete object", data)
			server.BroadcastTo(gameUuid, "total players", len(*game.Players)-1)

			playersNoDead := []PlayerSocket{}
			for _, player := range *game.Players {
				if player.socketId == so.Id() {
					continue
				}
				playersNoDead = append(playersNoDead, player)
			}
			*game.Players = playersNoDead

			if len(*game.Players) == 1 {
				so.BroadcastTo(gameUuid, "win")
			}
		})

		so.On("stop player", func(data interface{}) {
			server.BroadcastTo(gameUuid, "stop player", data)
		})

		so.Emit("game data", map[string]interface{}{
			"fire":  game.Fire,
			"start": game.PlayerId == playerId,
		})

		so.On("disconnection", func() {
			players := game.Players
			playersNoDead := []PlayerSocket{}
			for _, player := range *players {
				if player.socketId == so.Id() {
					server.BroadcastTo(gameUuid, "disconnection", player.data)
					s.playerApi.SetGame(uint(playerId), "")
					continue
				}
				playersNoDead = append(playersNoDead, player)
			}
			*game.Players = playersNoDead
			server.BroadcastTo(gameUuid, "total players", len(*game.Players))

			if len(playersNoDead) == 1 && game.Fire {
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
