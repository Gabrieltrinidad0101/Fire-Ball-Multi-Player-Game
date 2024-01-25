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
	player := ctx.Request().Context().Value("user").(services.Player)
	response := g.serviceGame.New(player)
	ctx.JSON(response.StatusCode, response)
	return nil
}

func (g *GameController) Start(ctx echo.Context) error {
	player := ctx.Request().Context().Value("user").(services.Player)
	response := g.serviceGame.Start(player)
	ctx.JSON(response.StatusCode, response)
	return nil
}

func (g *GameController) NewPlayer(ctx echo.Context) error {
	player := ctx.Request().Context().Value("user").(services.Player)
	response := g.serviceGame.Start(player)
	ctx.JSON(response.StatusCode, response)
	return nil
}

func (g *GameController) FindAll(ctx echo.Context) error {
	response := g.serviceGame.FindAll()
	ctx.JSON(response.StatusCode, response)
	return nil
}
