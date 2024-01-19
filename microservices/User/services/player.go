package services

import (
	"github.com/go-playground/validator/v10"
)

type PlayerModel interface {
	Insert(*Player)
	Find(*Player) Player
	FindByGame(string) []Player
	FindAll() []Player
}

type Token interface {
	CreateToken(Player) (string, error)
}

type Player struct {
	Name     string `json:"name",validate:"required"`
	Password string `json:"password"validate:"required"`
	Id       int    `json:"id"`
	GameId   int    `json:"gameId"`
}

func NewPlayer(playerModel PlayerModel, token Token) ServicePlayer {
	return ServicePlayer{
		PlayerModel: playerModel,
		Token:       token,
	}
}

type ServicePlayer struct {
	PlayerModel
	Token
}

type Response struct {
	StatusCode int
	Message    interface{} `json:"message"`
}

var validate = validator.New()

func (u *ServicePlayer) Login(player *Player) Response {
	if err := validate.Struct(player); err != nil {
		return Response{
			StatusCode: 402,
			Message:    "Name or Password  are incorrect",
		}
	}
	playerExist := u.Find(player)
	if playerExist.Name == "" {
		return Response{
			StatusCode: 402,
			Message:    "Name or Password  are incorrect",
		}
	}
	token, error := u.CreateToken(playerExist)

	if error != nil {
		return Response{
			Message:    "Error generating the access token please try later",
			StatusCode: 500,
		}
	}

	return Response{
		Message:    token,
		StatusCode: 500,
	}

}

func (u *ServicePlayer) Register(player *Player) Response {
	if err := validate.Struct(player); err != nil {
		return Response{
			StatusCode: 402,
			Message:    "Name and Password are requires",
		}
	}
	playerExist := u.Find(player)
	if playerExist.Name != "" {
		return Response{
			StatusCode: 402,
			Message:    "The user exist",
		}
	}

	u.Insert(player)

	token, error := u.CreateToken(playerExist)
	if error != nil {
		return Response{
			Message:    "Error generating the access token please try later",
			StatusCode: 500,
		}
	}

	return Response{
		Message:    token,
		StatusCode: 200,
	}

}

func (u *ServicePlayer) PlayersByGame(gameId string) Response {
	players := u.FindByGame(gameId)
	return Response{
		StatusCode: 200,
		Message:    players,
	}
}

func (u *ServicePlayer) FindAllPlayers() Response {
	players := u.PlayerModel.FindAll()
	return Response{
		StatusCode: 200,
		Message:    players,
	}
}
