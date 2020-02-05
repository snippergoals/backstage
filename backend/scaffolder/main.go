package main

import (
	"context"
	"log"
	"net"

	"github.com/spotify/backstage/scaffolder/app"
	"google.golang.org/grpc"
)

const (
	port = ":50051"
)

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterScaffolderServer(grpcServer, &app.Server{})
	log.Println("Serving Scaffolder Service")
	grpcServer.Serve(lis)
}
