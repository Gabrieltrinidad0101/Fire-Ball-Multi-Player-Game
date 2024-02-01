package services

import (
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
)

type PlayerModel interface {
	Insert(*Player)
	Find(*Player) Player
	FindById(uint) *Player
	FindByGame(string) []Player
	FindAll() []Player
	SetGame(playerId uint, GameUuid string)
	Winner(playerId uint)
}

type Token interface {
	CreateToken(*Player) (string, error)
}

type Player struct {
	Name      string `json:"name",validate:"required"`
	Password  string `json:"password"validate:"required"`
	Id        uint   `json:"id"`
	GameUuid  string `json:"gameuuid"`
	Victories int    `json:"victories"`
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
	player.Id = playerExist.Id
	token, error := u.CreateToken(player)

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

	token, error := u.CreateToken(player)
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

func (u *ServicePlayer) SetGame(stringPlayerId, stringGameUuid string) Response {
	playerId, err := strconv.ParseUint(stringPlayerId, 10, 64)
	if err != nil {
		response := Response{
			StatusCode: http.StatusBadRequest,
			Message:    "Invalid player id",
		}
		return response
	}
	// If the player dead the game id will be ""
	if stringGameUuid != "" {
		player := u.PlayerModel.FindById(uint(playerId))
		if player.GameUuid != "" {
			return Response{
				StatusCode: http.StatusBadRequest,
				Message:    "You are already into game",
			}
		}
	}
	u.PlayerModel.SetGame(uint(playerId), stringGameUuid)
	return Response{
		StatusCode: 200,
		Message:    "OK",
	}
}

func (u *ServicePlayer) Winner(playerId uint) Response {
	u.PlayerModel.Winner(playerId)
	return Response{
		StatusCode: 200,
		Message:    "OK",
	}
}
