package utils

import (
	"time"
	"user/services"

	"github.com/dgrijalva/jwt-go"
)

type PlayerJwt struct {
	services.Player
	jwt.StandardClaims
}

func GetJwtSecret() []byte {
	conf := LoadEnviroments()
	return []byte(conf.JwtSecret)
}

type JsonWebToken struct{}

// createToken implements services.Token.
func (JsonWebToken) CreateToken(player services.Player) (string, error) {
	userJwt := &PlayerJwt{
		Player: services.Player{
			Name: player.Name,
			Id:   player.Id,
		},
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 72).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, userJwt)
	tokenString, err := token.SignedString(GetJwtSecret())

	return tokenString, err
}
