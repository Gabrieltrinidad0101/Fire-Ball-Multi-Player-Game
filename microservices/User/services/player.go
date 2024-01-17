package services

import "github.com/go-playground/validator/v10"

type PlayerModel interface {
	Insert(Player)
	Find(Player) Player
	FindByGame(string) []Player
	FindAll() []Player
}

type Token interface {
	createToken(Player) (string, error)
	verifyToken(token string) (string, error)
}

type Player struct {
	Name     string `json:"name",validate:"required"`
	Password string `json:"password"validate:"required"`
	GameId   int
}

func NewPlayer(playerModel PlayerModel) ServicePlayer {
	return ServicePlayer{
		PlayerModel: playerModel,
	}
}

type ServicePlayer struct {
	Player
	PlayerModel
	Token
}

type Response struct {
	StatusCode int
	Message    interface{} `json:"message"`
}

var validate = validator.New()

func (u *ServicePlayer) Login(Player *Player) Response {
	if err := validate.Struct(Player); err != nil {
		return Response{
			StatusCode: 402,
			Message:    "Name or Password  are incorrect",
		}
	}
	playerExist := u.Find(u.Player)
	token, error := u.createToken(playerExist)

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

func (u *ServicePlayer) Register(Player *Player) Response {
	if err := validate.Struct(Player); err != nil {
		return Response{
			StatusCode: 402,
			Message:    "Name or Password  are incorrect",
		}
	}
	playerExist := u.Find(u.Player)

	if playerExist.Name == "" {
		return Response{
			StatusCode: 402,
			Message:    "Name or Password  are incorrect",
		}
	}

	token, error := u.createToken(playerExist)
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
