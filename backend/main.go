package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/websocket"
)

var clients = make(map[*websocket.Conn]bool)
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		return origin == "http://localhost:5173"
	},
}
var client = redis.NewClient(&redis.Options{
	Addr: "localhost:6379", // Redisのアドレス
})

func handleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer conn.Close()

	// WebSocket接続をクライアントリストに追加
	clients[conn] = true

	for {
		fmt.Println("waiting for message")
		// クライアントからのメッセージを受信
		_, msg, err := conn.ReadMessage()
		fmt.Println("received message")
		if err != nil {
			fmt.Println("read:", err)
			break
		}

		err = client.Set(context.Background(), "message", string(msg), 0).Err()
		if err != nil {
			fmt.Println("Failed to set message:", err)
			return
		}

		// redisのチャネルにメッセージを送信
		pubResult := client.Publish(context.Background(), "chat", string(msg))
		if pubResult.Err() != nil {
			fmt.Println("Failed to publish message:", err)
			return
		}
		fmt.Println("Message published to Redis channel 'chat'")
	}
}

func handleMessages() {
	pubsub := client.Subscribe((context.Background()), "chat")
	defer pubsub.Close()

	ch := pubsub.Channel()

	for msg := range ch {
		fmt.Printf("message: %s\n", msg.Payload)

		val, err := client.Get(context.Background(), "message").Result()
		if err != nil {
			fmt.Println("Failed to get message:", err)
			return
		}
		fmt.Println("message?:", val)

		for conn := range clients {
			err := conn.WriteMessage(websocket.TextMessage, []byte(val))
			if err != nil {
				fmt.Println("write:", err)
				conn.Close()
				delete(clients, conn)
			}
		}
	}
}

func main() {
	_, err := client.Ping(context.Background()).Result()
	if err != nil {
		fmt.Println("Failed to connect to Redis:", err)
		return
	}
	fmt.Println("Connected to Redis")

	go handleMessages()

	http.HandleFunc("/ws", handleConnections)
	http.ListenAndServe(":8000", nil)
}
