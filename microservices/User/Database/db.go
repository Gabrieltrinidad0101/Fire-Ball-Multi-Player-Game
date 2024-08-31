package database

import (
	"fmt"
	"user/utils"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func GetConnection() *gorm.DB {
	conf := utils.LoadEnviroments()
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/?charset=utf8mb4&parseTime=True&loc=Local",
		conf.DbUser,
		conf.DbPassword,
		conf.DbHost,
		conf.DbPort,
	)
	db, error := gorm.Open(mysql.Open(dsn))
	if error != nil {
		fmt.Errorf("Error %s", error.Error())
		panic("ERROR IN THE CONNECTION")
	}
	db.Exec("CREATE DATABASE IF NOT EXISTS " + conf.DbName)
	return db
}
