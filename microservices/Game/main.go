package main

import (
	"realTime/database"
	"realTime/router"

	"github.com/labstack/echo"
)

func main() {
	database.InitMigration()
	e := echo.New()
	router.Init(e)
	e.Start(":5001")
}
