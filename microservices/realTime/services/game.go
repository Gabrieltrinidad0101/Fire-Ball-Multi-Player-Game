package services

import (
	"github.com/google/uuid"
)

type Game struct {
	id       int
	uuid     string
	playerId int
	status   string
}

type ApiPlayer interface {
	setGame(gameId int)
}

type ModelGame interface {
	insert(Game)
	findByPlayerId(int) Game
	update(Game)
}

type Response struct {
	StatusCode int
	Message    interface{} `json:"message"`
}

type ServiceGame struct {
	ModelGame
	apiPlayer ApiPlayer
}

func NewGame() {

}

func (g *ServiceGame) New(playerId int) Response {
	game := g.findByPlayerId(playerId)
	if game.id > 0 {
		return Response{
			StatusCode: 200,
			Message:    game.id,
		}
	}
	newGame := Game{}
	newGame.playerId = playerId
	newGame.uuid = uuid.New()
	newGame.status = "loddy"
	g.insert(newGame)
	return Response{
		StatusCode: 200,
		Message:    newGame,
	}
}

func (g *ServiceGame) Start(playerId int) Response {
	game := g.findByPlayerId(playerId)
	game.status = "started"
	g.update(game)
	return Response{
		StatusCode: 200,
		Message:    game,
	}
}

func (g *ServiceGame) NewPlayer(playerId int) Response {
	game := g.findByPlayerId(playerId)
	canConnect := game.status == "started"

	if canConnect {
		g.apiPlayer.setGame(game.id)
	}

	return Response{
		StatusCode: 200,
		Message:    canConnect,
	}
}
