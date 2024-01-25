package conf

import (
	"realTime/apis"
	"realTime/controllers"
	"realTime/model"
	"realTime/services"
	"realTime/socket"
)

func Init() *Conf {
	return &Conf{}
}

type Conf struct{}

func (c *Conf) game() *services.ServiceGame {
	return services.NewGame(model.ModelGame{}, apis.ApisPlayer{})
}

func (c *Conf) GameController() *controllers.GameController {
	return controllers.NewGameController(c.game())
}

func (c *Conf) SocketController() *socket.SocketServer {
	return socket.NewSocketServer(model.ModelGame{}, apis.ApisPlayer{})
}
