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

	sqlDB, err := db.DB()
	if err != nil {
		panic(err)
	}
	sqlDB.Close()

	dsn = fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		conf.DbUser,
		conf.DbPassword,
		conf.DbHost,
		conf.DbPort,
		conf.DbName,
	)

	gormDB, err := gorm.Open(mysql.Open(dsn))
	if err != nil {
		fmt.Errorf("Error %s", error.Error())
		panic("ERROR IN THE CONNECTION")
	}

	fmt.Println("Connection to the database established")

	return gormDB
}
