package controllers

import (
	"realTime/services"

	"github.com/labstack/echo"
)

type GameController struct {
	services.ServiceGame
}

func (g *GameController) New(ctx echo.Context) {
	playerIdString := ctx.Param("playerId")
	response := g.ServiceGame.New(playerIdString)
	ctx.JSON(response.StatusCode, response)
}

func (g *GameController) Start(ctx echo.Context) {
	playerIdString := ctx.Param("playerId")
	response := g.ServiceGame.Start(playerIdString)
	ctx.JSON(response.StatusCode, response)
}

func (g *GameController) NewPlayer(ctx echo.Context) {
	playerIdString := ctx.Param("playerId")
	response := g.ServiceGame.Start(playerIdString)
	ctx.JSON(response.StatusCode, response)
}
