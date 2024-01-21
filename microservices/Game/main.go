package main

import (
	"realTime/router"

	"github.com/labstack/echo"
)

func main() {
	e := echo.New()
	router.Init(e)
	e.Start(":5001")
}
