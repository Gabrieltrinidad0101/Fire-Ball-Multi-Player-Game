package model

import (
	database "user/Database"
	"user/services"
)

type PlayerModel struct{}

var db = database.GetConnection()

func (u PlayerModel) Find(playerToSearch *services.Player) services.Player {
	var player services.Player
	db.Model(&player).Where("name = ? and password = ?", playerToSearch.Name, playerToSearch.Password)
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

func (u PlayerModel) FindAll() []services.Player {
	var player []services.Player
	db.Find(&player)
	return player
}
