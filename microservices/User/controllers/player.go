package controllers

import (
	"user/services"

	"github.com/labstack/echo/v4"
)

type PlayerController struct {
	services.ServicePlayer
}

func NewPlayerController(servicePlayer services.ServicePlayer) *PlayerController {
	return &PlayerController{
		servicePlayer,
	}
}

func (p *PlayerController) LoginController(ctx echo.Context) error {
	var player = services.Player{}
	ctx.Bind(&player)
	response := p.Login(&player)
	ctx.JSON(response.StatusCode, response.Message)
	return nil
}

func (p *PlayerController) RegisterController(ctx echo.Context) error {
	var player = services.Player{}
	ctx.Bind(&player)
	response := p.Register(&player)
	ctx.JSON(response.StatusCode, response.Message)
	return nil
}

func (p *PlayerController) PlayersByGameController(ctx echo.Context) error {
	id := ctx.Param("id")
	response := p.PlayersByGame(id)
	ctx.JSON(response.StatusCode, response.Message)
	return nil
}

func (p *PlayerController) FindAllPlayersController(ctx echo.Context) error {
	response := p.FindAllPlayers()
	ctx.JSON(response.StatusCode, response.Message)
	return nil
}
