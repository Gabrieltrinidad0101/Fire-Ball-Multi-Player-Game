package controllers

import (
	"net/http"
	"strconv"
	"user/services"
	"user/utils"

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
	player := ctx.Get("player").(*utils.PlayerJwt)
	response := services.Response{
		StatusCode: 200,
		Message: services.Player{
			Name: player.Name,
			Id:   player.Player.Id,
		},
	}
	ctx.JSON(response.StatusCode, response)
	return nil
}

func (p *PlayerController) SetGame(ctx echo.Context) error {
	stringGameId := ctx.QueryParam("gameId")
	gameId, err := strconv.Atoi(stringGameId)
	if err != nil {
		response := services.Response{
			StatusCode: http.StatusBadRequest,
			Message:    "Invalid game id",
		}
		return ctx.JSON(response.StatusCode, response)
	}
	player := ctx.Get("player").(*utils.PlayerJwt)
	p.ServicePlayer.SetGame(&services.Player{
		Name:     player.Name,
		Password: player.Password,
		Id:       player.Player.Id,
		GameId:   player.GameId,
	}, uint(gameId))
	return nil
}
