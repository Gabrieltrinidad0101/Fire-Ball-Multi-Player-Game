package services

import (
	"strconv"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Game struct {
	gorm.Model
	Uuid     string `json:"uuid"`
	PlayerId int    `json:"playerId"`
	Status   string `json:"status"`
}

type Player struct {
	Name string `json:"name"`
	Id   int    `json:"id"`
}

type ApiPlayer interface {
	SetGame(gameId uint)
	GetData(tokenPlayer string) *Player
}

type ModelGame interface {
	Insert(*Game)
	FindByPlayerId(int) *Game
	Update(*Game)
	FindAll() *[]Game
}

type Response struct {
	StatusCode int
	Message    interface{} `json:"message"`
}

type ServiceGame struct {
	modelGame ModelGame
	apiPlayer ApiPlayer
}

func NewGame(modelGame ModelGame, apiPlayer ApiPlayer) *ServiceGame {
	return &ServiceGame{
		modelGame,
		apiPlayer,
	}
}

func (g *ServiceGame) New(playerIdString string) Response {
	playerId, err := strconv.Atoi(playerIdString)
	if err != nil {
		res := Response{
			StatusCode: 401,
			Message:    err,
		}
		return res
	}
	game := g.modelGame.FindByPlayerId(playerId)
	if game.ID > 0 {
		return Response{
			StatusCode: 200,
			Message:    game,
		}
	}
	newGame := &Game{}
	newGame.PlayerId = playerId
	newGame.Uuid = uuid.NewString()
	newGame.Status = "loddy"
	g.modelGame.Insert(newGame)
	return Response{
		StatusCode: 200,
		Message:    newGame,
	}
}

func (g *ServiceGame) Start(playerIdString string) Response {
	playerId, err := strconv.Atoi(playerIdString)
	if err != nil {
		res := Response{
			StatusCode: 401,
			Message:    "Error in the playerID",
		}
		return res
	}
	game := g.modelGame.FindByPlayerId(playerId)
	game.Status = "started"
	g.modelGame.Update(game)
	return Response{
		StatusCode: 200,
		Message:    game,
	}
}

func (g *ServiceGame) NewPlayer(playerIdString string) Response {
	playerId, err := strconv.Atoi(playerIdString)
	if err != nil {
		res := Response{
			StatusCode: 401,
			Message:    "Error in the playerID",
		}
		return res
	}
	game := g.modelGame.FindByPlayerId(playerId)
	canConnect := game.Status == "started"

	if canConnect {
		g.apiPlayer.SetGame(game.ID)
	}

	return Response{
		StatusCode: 200,
		Message:    canConnect,
	}
}

func (g *ServiceGame) FindAll() Response {
	game := g.modelGame.FindAll()
	return Response{
		StatusCode: 200,
		Message:    game,
	}
}
