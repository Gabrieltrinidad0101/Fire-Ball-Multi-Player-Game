package model

import (
	"fmt"
	database "user/Database"
	"user/services"

	"gorm.io/gorm"
)

type PlayerModel struct{}

var db = database.GetConnection()

func (u PlayerModel) Find(playerToSearch *services.Player) services.Player {
	var player services.Player
	db.Where("name = ?", playerToSearch.Name).First(&player)
	return player
}

func (u PlayerModel) FindById(playerId uint) *services.Player {
	var player services.Player
	db.Where("id = ?", playerId).First(&player)
	return &player
}

func (u PlayerModel) Insert(player *services.Player) {
	db.Create(player)
}

func (u PlayerModel) FindByGame(GameUuid string) []services.Player {
	var player []services.Player
	db.Model(&player).Where("game_uuid = ?", GameUuid)
	return player
}

func (u PlayerModel) SetGame(playerId uint, gameUuid string) {
	var player []services.Player
	db.Model(&player).Where("id = ?", playerId).Update("game_uuid", gameUuid)
}

func (u PlayerModel) FindAll() []services.Player {
	var player []services.Player
	db.Find(&player).Order("victories DESC")
	return player
}

func (u PlayerModel) Winner(playerId uint) {
	err := db.Model(services.Player{}).Where("id = ?", playerId).UpdateColumn("victories", gorm.Expr("victories + ?", 1))
	fmt.Print(err)
}
