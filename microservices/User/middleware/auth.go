package middleware

import (
	"encoding/base64"
	"net/http"
	"strings"
	"user/services"
	"user/utils"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
)

var errorResponse = services.Response{
	StatusCode: http.StatusUnauthorized,
	Message:    "Invalid token",
}

func Auth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(ctx echo.Context) error {
		tokenString := ctx.Request().Header.Get("x-token")
		if tokenString == "" {
			return microservicesAuth(ctx, next)
		}
		return userAuth(ctx, next)
	}
}

func MicroservicesAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(ctx echo.Context) error {
		return microservicesAuth(ctx, next)
	}
}

func userAuth(ctx echo.Context, next echo.HandlerFunc) error {
	tokenString := ctx.Request().Header.Get("x-token")

	if tokenString == "" {
		return ctx.JSON(errorResponse.StatusCode, errorResponse)
	}

	token, err := jwt.ParseWithClaims(tokenString, &utils.PlayerJwt{}, func(t *jwt.Token) (interface{}, error) {
		return utils.GetJwtSecret(), nil
	})

	if err != nil {
		return ctx.JSON(errorResponse.StatusCode, errorResponse)
	}

	if player, ok := token.Claims.(*utils.PlayerJwt); ok && token.Valid {
		ctx.Set("player", player)
		return next(ctx)
	}

	return ctx.JSON(errorResponse.StatusCode, errorResponse)
}

func microservicesAuth(ctx echo.Context, next echo.HandlerFunc) error {
	tokenString := ctx.Request().Header.Get("x-token-microservice")
	decodedBytes, err := base64.StdEncoding.DecodeString(tokenString)
	if err != nil {
		return ctx.JSON(errorResponse.StatusCode, errorResponse)
	}

	decodedString := string(decodedBytes)
	authData := strings.Split(decodedString, ":")

	if len(authData) != 2 {
		return ctx.JSON(errorResponse.StatusCode, errorResponse)
	}

	microservices := utils.NewMicroservicesAuth()
	access := microservices.VerifyAuthentication(&utils.Microservice{
		Name:     authData[0],
		Password: authData[1],
	})
	if !access {
		return ctx.JSON(errorResponse.StatusCode, errorResponse)
	}
	return next(ctx)
}
