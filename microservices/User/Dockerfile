FROM golang:1.22

WORKDIR /go/src/app

COPY go.mod .

COPY go.sum .

RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 8000

CMD ["./main"]