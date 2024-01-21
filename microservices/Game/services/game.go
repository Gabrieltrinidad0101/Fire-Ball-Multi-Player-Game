package services

import (
	"strconv"

	"github.com/google/uuid"
)

type Game struct {
	id       int
	uuid     string
	playerId int
	status   string
}

type ApiPlayer interface {
	SetGame(gameId int)
}

type ModelGame interface {
	Insert(Game)
	FindByPlayerId(int) Game
	Update(Game)
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
			Message:    "Error in the playerID",
		}
		return res
	}
	game := g.modelGame.FindByPlayerId(playerId)
	if game.id > 0 {
		return Response{
			StatusCode: 200,
			Message:    game.id,
		}
	}
	newGame := Game{}
	newGame.playerId = playerId
	newGame.uuid = uuid.NewString()
	newGame.status = "loddy"
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
	game.status = "started"
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
	canConnect := game.status == "started"

	if canConnect {
		g.apiPlayer.SetGame(game.id)
	}

	return Response{
		StatusCode: 200,
		Message:    canConnect,
	}
}
