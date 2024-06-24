FROM golang:1.22

WORKDIR /go/src/app

COPY . .

RUN go mod download

RUN go build -o main .

EXPOSE 5001

CMD ["./main"]