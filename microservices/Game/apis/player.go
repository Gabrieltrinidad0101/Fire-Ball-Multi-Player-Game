package apis

import (
	"fmt"
	"io"
	"net/http"
	"realTime/utils"
)

type ApisPlayer struct{}

func (a ApisPlayer) SetGame(gameId int) {
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
