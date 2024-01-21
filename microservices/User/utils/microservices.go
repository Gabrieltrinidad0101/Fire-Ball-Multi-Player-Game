package utils

type Microservice struct {
	Name     string
	Password string
}

type MicroservicesAuth struct{}

var microservices *[]Microservice

func NewMicroservicesAuth() *MicroservicesAuth {
	return &MicroservicesAuth{}
}

func (m *MicroservicesAuth) LoadMicroservicesAuthentication() {
	if microservices != nil {
		return
	}
	conf := LoadEnviroments()
	*microservices = append(*microservices, Microservice{
		Name:     conf.MicroserviceGame,
		Password: conf.MicroserviceGamePassword,
	})
}

func (m *MicroservicesAuth) VerifyAuthentication(microserviceToVerify *Microservice) bool {
	for _, microservice := range *microservices {
		if microservice.Name == microserviceToVerify.Name && microservice.Password == microserviceToVerify.Password {
			return true
		}
		continue
	}
	return false
}
