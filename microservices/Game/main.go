package main

import (
	"realTime/database"
	"realTime/router"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	database.InitMigration()
	e := echo.New()
	e.Use(middleware.CORS())
	router.Init(e)
	e.Start(":5001")
}
