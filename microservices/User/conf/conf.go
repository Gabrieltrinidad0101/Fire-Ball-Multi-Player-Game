package conf

import (
	"user/controllers"
	"user/model"
	"user/services"
	"user/utils"
)

type Config struct{}

func Init() *Config {
	return &Config{}
}

func (c *Config) Player() services.ServicePlayer {
	return services.NewPlayer(model.PlayerModel{}, utils.JsonWebToken{})
}

func (c *Config) PlayerController() *controllers.PlayerController {
	return controllers.NewPlayerController(
		c.Player(),
	)
}
