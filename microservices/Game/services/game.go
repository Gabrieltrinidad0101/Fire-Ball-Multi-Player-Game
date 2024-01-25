package services

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Game struct {
	gorm.Model
	Uuid     string `json:"uuid"`
	PlayerId int    `json:"player.Id"`
	Status   string `json:"status"`
}

type Player struct {
	Name string `json:"name"`
	Id   int    `json:"id"`
}

type ApiPlayer interface {
	SetGame(gameId uint)
	GetData(tokenPlayer string) (*Player, error)
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

func (g *ServiceGame) New(player *Player) Response {
	game := g.modelGame.FindByPlayerId(player.Id)
	if game.ID > 0 {
		return Response{
			StatusCode: 200,
			Message:    game,
		}
	}
	newGame := &Game{}
	newGame.PlayerId = player.Id
	newGame.Uuid = uuid.NewString()
	newGame.Status = "loddy"
	g.modelGame.Insert(newGame)
	return Response{
		StatusCode: 200,
		Message:    newGame,
	}
}

func (g *ServiceGame) Start(player *Player) Response {
	game := g.modelGame.FindByPlayerId(player.Id)
	game.Status = "started"
	g.modelGame.Update(game)
	return Response{
		StatusCode: 200,
		Message:    game,
	}
}

func (g *ServiceGame) NewPlayer(player *Player) Response {
	game := g.modelGame.FindByPlayerId(player.Id)
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
