package middleware

import (
	"net/http"
	"realTime/apis"
	"realTime/services"

	"github.com/labstack/echo"
)

func Auth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(ctx echo.Context) error {
		errorResponse := services.Response{
			StatusCode: http.StatusUnauthorized,
			Message:    "Invalid token",
		}

		tokenString := ctx.Request().Header.Get("x-token")

		if tokenString == "" {
			return ctx.JSON(errorResponse.StatusCode, errorResponse)
		}

		apisPlayer := apis.ApisPlayer{}
		player, err := apisPlayer.GetData(tokenString)
		if err != nil {
			return ctx.JSON(errorResponse.StatusCode, errorResponse)
		}
		ctx.Set("player", player)
		return next(ctx)
	}
}
