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
func (m ModelGame) FindById(id uint) *services.Game {
	var game services.Game
	db.Model(&game).Where("id = ?", id)
	return &game
}
func (m ModelGame) FindByPlayerId(playerId int) *services.Game {
	var game services.Game
	db.Model(&game).Where("player_id = ?", playerId)
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
