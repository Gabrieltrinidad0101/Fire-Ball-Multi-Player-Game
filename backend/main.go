package main

import (
	"fmt"
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
)

func main() {
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal("error establishing new socketio server")
	}

	server.On("connection", func(so socketio.Socket) {
		so.Join("mychat")
		so.On("chat message", func(msg string) {
			so.BroadcastTo("mychat", "chat message", msg)
		})
	})

	fmt.Println("Server running on localhost: 5001")

	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", fs)

	http.Handle("/socket.io/", server)

	log.Fatal(http.ListenAndServe(":5001", nil))
}
