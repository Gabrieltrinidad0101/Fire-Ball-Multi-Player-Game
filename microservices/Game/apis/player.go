package apis

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"realTime/services"
	"realTime/utils"
)

type ApisPlayer struct{}

func (a ApisPlayer) SetGame(gameId uint) {
	configuration := utils.LoadEnviroments()
	request, err := http.NewRequest("GET", configuration.PlayerUrl, nil)
	if err != nil {
		fmt.Println("Error creating GET request:", err)
		return
	}
	request.Header.Set("x-token-microservices", configuration.TokenMicroservice)
	response, err := http.Get(configuration.PlayerUrl)
	if err != nil {
		fmt.Println("Error making GET request:", err)
		return
	}

	defer response.Body.Close()

	_, err = io.ReadAll(response.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return
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

	var player services.Player
	if err := json.Unmarshal(body, &player); err != nil {
		panic(err)
	}
	return &player, nil
}
