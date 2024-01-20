package model

import "realTime/services"

// type ModelGame interface {
// 	insert(Game)
// 	findByPlayerId(int) Game
// 	update(Game)
// }

type ModelGame struct{}

func (m *ModelGame) insert(services.Game) {

}
func (m *ModelGame) findByPlayerId(playerId int) {}
func (m *ModelGame) update(services.Game)        {}
