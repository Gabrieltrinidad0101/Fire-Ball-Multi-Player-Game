package database

import "realTime/services"

func InitMigration() (ok bool) {
	db := GetConnection()
	db.AutoMigrate(&services.Game{})
	return
}
