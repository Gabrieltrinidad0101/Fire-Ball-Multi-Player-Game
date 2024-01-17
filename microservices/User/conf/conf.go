package conf

import (
	"user/controllers"
	"user/model"
	"user/services"
)

type Config struct{}

func (c *Config) Player() services.ServicePlayer {
	return services.NewPlayer(model.PlayerModel{})
}

func (c *Config) PlayerController() *controllers.PlayerController {
	return controllers.NewPlayerController(
		c.Player(),
	)
}
