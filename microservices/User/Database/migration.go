package database

import (
	"user/services"
)

func InitMigration() (ok bool) {
	db := GetConnection()
	db.AutoMigrate(&services.Player{})
	return
}
