# Forecast service

## Description

Прогноз погоды (температуры), по городу и времени

**Текущая погода**

http://localhost:3000/v1/current?city=Moscow

**Прогноз погоды**

http://localhost:3000/v1/forecast?city=Moscow&dt=2023-03-25T09:00:00

GET запросы

Ответы типа: `{"city":"Moscow","unit":"celsius","temperature":5.9}`

## Development

```bash
# run
$ docker compose up -d

# logs
$ docker compose logs -f

# interactive sh
$ docker exec -it $(docker ps -a -q --filter ancestor=forecast --format="{{.ID}}") /bin/sh

# stop
$ docker compose down
```

## Production

```bash
# build
$ docker build . -t forecast

# run
$ docker run -dp 3000:3000 forecast

# stop
$ docker rm $(docker stop $(docker ps -a -q --filter ancestor=forecast --format="{{.ID}}"))
```

## Todo
* Aspect logs for services and controllers 
* Fix DTO and types
* Send error message to client
* Parse DateTime for getForecast
