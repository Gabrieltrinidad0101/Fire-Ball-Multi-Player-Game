package controllers

import (
	"user/services"

	"github.com/labstack/echo"
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
	ctx.JSON(response.StatusCode, response)
	return nil
}

func (p *PlayerController) RegisterController(ctx echo.Context) error {
	var player = services.Player{}
	ctx.Bind(&player)
	response := p.Register(&player)
	ctx.JSON(response.StatusCode, response)
	return nil
}

func (p *PlayerController) PlayersByGameController(ctx echo.Context) error {
	idGame := ctx.Param("idGame")
	response := p.PlayersByGame(idGame)
	ctx.JSON(response.StatusCode, response)
	return nil
}

func (p *PlayerController) FindAllPlayersController(ctx echo.Context) error {
	response := p.FindAllPlayers()
	ctx.JSON(response.StatusCode, response)
	return nil
}

func (p *PlayerController) GetDataFromUser(ctx echo.Context) error {
	player := ctx.Request().Context().Value("user").(services.Player)
	response := services.Response{
		StatusCode: 200,
		Message:    player,
	}
	ctx.JSON(response.StatusCode, response)
	return nil
}
