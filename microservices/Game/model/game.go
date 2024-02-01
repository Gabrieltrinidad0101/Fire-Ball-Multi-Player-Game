package model

import (
	"realTime/database"
	"realTime/services"
)

type ModelGame struct{}

var db = database.GetConnection()

func (m ModelGame) Insert(game *services.Game) {
	db.Create(game)
}
func (m ModelGame) FindByUuid(uuid string) *services.Game {
	var game services.Game
	db.Where("uuid = ?", uuid).First(&game)
	return &game
}
func (m ModelGame) FindByPlayerId(playerId int) *services.Game {
	var game services.Game
	db.Where("player_id = ?", playerId).First(&game)
	return &game
}
func (m ModelGame) Update(game *services.Game) {
	db.Updates(game)
}

func (m ModelGame) FindAll() *[]services.Game {
	var games []services.Game
	db.Find(&games).Where("status != finished")
	return &games
}

func (m ModelGame) Delete(gameUuid string) {
	var games services.Game
	db.Model(&games).Delete("game_uuid == ?", gameUuid)
}
