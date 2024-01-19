package middleware

import (
	"net/http"
	"user/services"
	"user/utils"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
)

func Auth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(ctx echo.Context) error {
		tokenString := ctx.Request().Header.Get("x-token")

		errorResponse := services.Response{
			StatusCode: http.StatusUnauthorized,
			Message:    "Invalid token",
		}

		if tokenString == "" {
			return ctx.JSON(errorResponse.StatusCode, errorResponse.Message)
		}

		token, err := jwt.ParseWithClaims(tokenString, &utils.PlayerJwt{}, func(t *jwt.Token) (interface{}, error) {
			return utils.GetJwtSecret(), nil
		})

		if err != nil {
			return ctx.JSON(errorResponse.StatusCode, errorResponse.Message)
		}

		if _, ok := token.Claims.(*utils.PlayerJwt); ok && token.Valid {
			ctx.Set("user", token)
			return next(ctx)
		}

		return ctx.JSON(errorResponse.StatusCode, errorResponse.Message)

	}
}
