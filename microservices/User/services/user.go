package services

import "github.com/go-playground/validator/v10"

type UserModel interface {
	find(User) (User, error)
	insert(User) (User, error)
	findByGame(GameId string) ([]User, error)
	findAll() ([]User, error)
}

type Token interface {
	createToken(User) (string, error)
	verifyToken(token string) (string, error)
}

type User struct {
	Name     string `json:"name",validate:"required"`
	Password string `json:"password"validate:"required"`
	GameId   int
}

type ServicesUser struct {
	User
	UserModel
	Token
}

type Response struct {
	StatusCode int
	Message    string `json:"message"`
}

var validate = validator.New()

func (u *ServicesUser) Login(user *User) Response {
	if err := validate.Struct(user); err != nil {
		return Response{
			StatusCode: 402,
			Message:    "Name or Password  are incorrect",
		}
	}
	userExist, error := u.find(u.User)
	if error != nil {
		return Response{
			StatusCode: 402,
			Message:    "Name or Password  are incorrect",
		}
	}
	token, error := u.createToken(userExist)
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

func (u *ServicesUser) Register(user *User) Response {
	if err := validate.Struct(user); err != nil {
		return Response{
			StatusCode: 402,
			Message:    "Name or Password  are incorrect",
		}
	}
	userExist, error := u.find(u.User)
	if error != nil {
		return Response{
			StatusCode: 402,
			Message:    "Name or Password  are incorrect",
		}
	}

	if userExist.Name == "" {
		return Response{
			StatusCode: 402,
			Message:    "Name or Password  are incorrect",
		}
	}

	token, error := u.createToken(userExist)
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

func (u *ServicesUser) UserByGame(gameId string) ([]User, error) {
	return u.findByGame(gameId)
}

func (u *ServicesUser) findAll() ([]User, error) {
	return u.UserModel.findAll()
}
