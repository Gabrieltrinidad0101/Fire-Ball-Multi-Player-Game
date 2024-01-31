package model

import (
	database "user/Database"
	"user/services"
)

type PlayerModel struct{}

var db = database.GetConnection()

func (u PlayerModel) Find(playerToSearch *services.Player) services.Player {
	var player services.Player
	db.Where("name = ?", playerToSearch.Name).First(&player)
	return player
}

func (u PlayerModel) Insert(player *services.Player) {
	db.Create(player)
}

func (u PlayerModel) FindByGame(GameId string) []services.Player {
	var player []services.Player
	db.Model(&player).Where("game_id = ?", GameId)
	return player
}

func (u PlayerModel) SetGame(playerId uint, GameId uint) {
	var player []services.Player
	db.Model(&player).Where("id = ?", playerId).Update("game_id = ?", GameId)
}

func (u PlayerModel) FindAll() []services.Player {
	var player []services.Player
	db.Find(&player)
	return player
}
