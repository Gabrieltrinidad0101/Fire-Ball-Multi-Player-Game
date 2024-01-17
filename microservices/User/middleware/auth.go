package middleware

import (
	"net/http"
	"user/services"
	"user/utils"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
)

func Auth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(ctx echo.Context) error {
		tokenString := ctx.Request().Header.Get("x-token")

		errorResponse := services.Response{
			StatusCode: http.StatusUnauthorized,
			Message:    "Invalid token",
		}

		if tokenString != "" {
			return ctx.JSON(errorResponse.StatusCode, errorResponse.Message)
		}

		token, err := jwt.ParseWithClaims(tokenString, &structs.UserJwt{}, func(t *jwt.Token) (interface{}, error) {
			conf := utils.Configuration{}
			conf.LoadEnviroments()
			return conf.JwtSecret, nil
		})

		if err != nil {
			return ctx.JSON(errorResponse.StatusCode, errorResponse.Message)
		}

		if _, ok := token.Claims.(*structs.UserJwt); ok && token.Valid {
			ctx.Set("user", token)
			return next(ctx)
		}

		return ctx.JSON(errorResponse.StatusCode, errorResponse.Message)

	}
}
