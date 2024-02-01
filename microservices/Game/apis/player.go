package apis

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"realTime/services"
	"realTime/utils"
)

type ApisPlayer struct{}

func (a ApisPlayer) SetGame(playerId uint, gameId string) {
	configuration := utils.LoadEnviroments()

	url := fmt.Sprintf("%s/player/getData?playerId=%d&gameUuid=%s", configuration.PlayerUrl, playerId, gameId)
	request, err := http.NewRequest("POST", url, nil)
	if err != nil {
		fmt.Println("Error creating POST request:", err)
		return
	}
	request.Header.Set("x-token-microservices", configuration.TokenMicroservice)
	client := http.Client{}
	response, err := client.Do(request)
	if err != nil {
		fmt.Println("Error making GET request:", err)
		return
	}

	defer response.Body.Close()

	if _, err := io.ReadAll(response.Body); err != nil {
		fmt.Println("Error reading response body:", err)
	}
}

func (a ApisPlayer) Win(playerId uint) {
	configuration := utils.LoadEnviroments()

	url := fmt.Sprintf("%s/player/win", configuration.PlayerUrl)
	player := services.Player{
		Id: int(playerId),
	}

	jsonData, err := json.Marshal(player)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	request, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Println("Error creating POST request:", err)
		return
	}
	request.Header.Set("x-token-microservices", configuration.TokenMicroservice)
	client := http.Client{}
	response, err := client.Do(request)
	if err != nil {
		fmt.Println("Error making GET request:", err)
		return
	}

	defer response.Body.Close()

	if _, err := io.ReadAll(response.Body); err != nil {
		fmt.Println("Error reading response body:", err)
	}
}

func (a ApisPlayer) GetData(tokenPlayer string) (*services.Player, error) {
	configuration := utils.LoadEnviroments()

	url := fmt.Sprintf("%s/player/getData", configuration.PlayerUrl)
	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println("Error creating GET request:", err)
		return nil, err
	}
	request.Header.Set("x-token", tokenPlayer)
	client := http.Client{}
	response, err := client.Do(request)
	if err != nil {
		fmt.Println("Error making GET request:", err)
		return nil, err
	}

	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return nil, err
	}

	var GetResponse services.Response
	if err := json.Unmarshal(body, &GetResponse); err != nil {
		panic(err)
	}
	data := GetResponse.Message.(map[string]interface{})

	return &services.Player{
		Name: data["name"].(string),
		Id:   int(data["id"].(float64)),
	}, nil
}
