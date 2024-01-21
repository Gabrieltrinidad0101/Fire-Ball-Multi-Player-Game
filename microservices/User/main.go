package main

import (
	database "user/Database"
	"user/router"
	"user/utils"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	database.InitMigration()
	microservices := utils.NewMicroservicesAuth()
	microservices.LoadMicroservicesAuthentication()
	server := echo.New()
	server.Use(middleware.CORS())
	router.Init(server)
	server.Start(":8000")
}
