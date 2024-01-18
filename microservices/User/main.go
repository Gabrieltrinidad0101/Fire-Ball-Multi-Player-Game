package main

import (
	database "user/Database"
	"user/router"

	"github.com/labstack/echo/v4"
)

func main() {
	database.InitMigration()
	server := echo.New()
	router.Init(server)
	server.Start(":8080")
}
