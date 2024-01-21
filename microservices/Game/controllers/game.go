package controllers

import (
	"realTime/services"

	"github.com/labstack/echo"
)

type GameController struct {
	serviceGame *services.ServiceGame
}

func NewGameController(serviceGame *services.ServiceGame) *GameController {
	return &GameController{
		serviceGame,
	}
}

func (g *GameController) New(ctx echo.Context) error {
	playerIdString := ctx.Param("playerId")
	response := g.serviceGame.New(playerIdString)
	ctx.JSON(response.StatusCode, response)
	return nil
}

func (g *GameController) Start(ctx echo.Context) error {
	playerIdString := ctx.Param("playerId")
	response := g.serviceGame.Start(playerIdString)
	ctx.JSON(response.StatusCode, response)
	return nil
}

func (g *GameController) NewPlayer(ctx echo.Context) error {
	playerIdString := ctx.Param("playerId")
	response := g.serviceGame.Start(playerIdString)
	ctx.JSON(response.StatusCode, response)
	return nil
}
