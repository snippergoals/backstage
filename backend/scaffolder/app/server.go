package app

import (
	"context"
	"fmt"
	identity "github.com/spotify/backstage/backend/proto/identity/v1"
	pb "github.com/spotify/backstage/proto/scaffolder/v1"
	"github.com/spotify/backstage/scaffolder/remote"
	"github.com/spotify/backstage/scaffolder/repository"
)

// Server is the inventory Grpc server
type Server struct {
	repository *repository.Repository
	github     *remote.Github
}

// NewServer creates a new server for with all the things
func NewServer() *Server {
	return &Server{
		github: remote.NewGithubClient(),
	}
}

// Create scaffolds the repo in github and then will create push to the repository
func (s *Server) Create(ctx context.Context, req *pb.CreateRequest) (*pb.CreateReply, error) {
	repo := remote.Repository{
		Name:    req.ComponentId,
		Org:     req.Org,
		Private: req.Private,
	}

	err := s.github.CreateRepository(repo)

	fmt.Println("Meta is")
	fmt.Println(req.Metadata)
	fmt.Println("error is")
	fmt.Println(err)

	return nil, nil
	// first create the repository with github

	// move the template into a temporary directory

	// use git bindings to add the remote with access token and push to the directory
}

// ListTemplates returns the local templatess
func (s *Server) ListTemplates(ctx context.Context, req *pb.Empty) (*pb.ListTemplatesReply, error) {
	// todo (blam): yes we currently read the disk on every load. but it's fine for now 🤷‍♂️
	definitions, err := s.repository.Load()
	var templates []*pb.Template

	for _, definition := range definitions {
		template := &pb.Template{
			Id:          definition.ID,
			Name:        definition.Name,
			Description: definition.Description,
			// need to actually call the idenity service here to get the
			// actual user and propgate back when needed.
			User: &identity.User{
				Id:   "spotify",
				Name: "Spotify",
			},
		}

		templates = append(templates, template)
	}

	return &pb.ListTemplatesReply{
		Templates: templates,
	}, err
}
