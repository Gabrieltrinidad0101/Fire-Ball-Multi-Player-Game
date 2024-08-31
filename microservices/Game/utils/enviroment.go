package utils

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Configuration struct {
	DbName            string
	DbPort            int32
	DbUser            string
	DbPassword        string
	DbHost            string
	PlayerUrl         string
	TokenMicroservice string
}

func LoadEnviroments() *Configuration {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
	var c = &Configuration{}
	c.DbHost = os.Getenv("DB_HOST")
	c.DbName = os.Getenv("DB_NAME")
	c.DbPassword = os.Getenv("DB_PASSWORD")
	port, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		log.Fatal(fmt.Sprintf("Error in the database port %s", err))
	}
	c.DbPort = int32(port)
	c.DbUser = os.Getenv("DB_USER")
	c.PlayerUrl = os.Getenv("PLAYER_URL")
	c.TokenMicroservice = os.Getenv("TOKEN_MICROSERVICE")
	return c
}
