package main

import (
	database "user/Database"
	"user/router"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	database.InitMigration()
	server := echo.New()
	server.Use(middleware.CORS())
	router.Init(server)
	server.Start(":8000")
}
