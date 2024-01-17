package services

type Game struct {
	Id       int `gorm:"primaryKey"`
	PlayerId int `json:"playerid"`
}
