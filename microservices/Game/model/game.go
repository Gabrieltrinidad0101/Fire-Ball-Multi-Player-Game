package model

import "realTime/services"

type ModelGame struct{}

func (m ModelGame) Insert(services.Game) {}
func (m ModelGame) FindByPlayerId(int) services.Game {
	return services.Game{}
}
func (m ModelGame) Update(services.Game) {}
