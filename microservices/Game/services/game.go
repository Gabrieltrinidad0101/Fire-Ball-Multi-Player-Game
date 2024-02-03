package services

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Game struct {
	gorm.Model
	Uuid     string `json:"uuid"`
	PlayerId int    `json:"player.Id"`
}

type Player struct {
	Name string `json:"name"`
	Id   int    `json:"id"`
}

type ApiPlayer interface {
	GetData(tokenPlayer string) (*Player, error)
	Win(playerId uint)
}

type ModelGame interface {
	Insert(*Game)
	FindByPlayerId(int) *Game
	Update(*Game)
	FindAll() *[]Game
	Delete(gameUuid string)
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

func (g *ServiceGame) New(player *Player) Response {
	game := g.modelGame.FindByPlayerId(player.Id)
	if game.ID > 0 {
		return Response{
			StatusCode: 409,
			Message:    "You are in a game ",
		}
	}
	newGame := &Game{}
	newGame.PlayerId = player.Id
	newGame.Uuid = uuid.NewString()[0:10]
	g.modelGame.Insert(newGame)
	return Response{
		StatusCode: 200,
		Message:    newGame,
	}
}

func (g *ServiceGame) Start(player *Player) Response {
	game := g.modelGame.FindByPlayerId(player.Id)
	g.modelGame.Update(game)
	return Response{
		StatusCode: 200,
		Message:    game,
	}
}

func (g *ServiceGame) FindAll() Response {
	game := g.modelGame.FindAll()
	return Response{
		StatusCode: 200,
		Message:    game,
	}
}

func (g *ServiceGame) DeleteGame(playerId uint, gameUuid string) {
	g.modelGame.Delete(gameUuid)
}
