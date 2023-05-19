# Weather

## Description

Прогноз погоды (температуры), по городу и времени

**Текущая погода**

http://localhost:3000/v1/current?city=Moscow

**Прогноз погоды**

http://localhost:3000/v1/forecast?city=Moscow&dt=2023-03-25T09:00:00

GET запросы с заголовком `Own-Auth-UserName` и значением `Andrey`

Ответы типа: `{"city":"Moscow","unit":"celsius","temperature":5.9}`

## Production

```bash
# run
$ docker compose up

# stop
$ docker compose down
```

## Todo

- Aspect logs for services and controllers
- Fix DTO and types
- Send error message to client
- Parse DateTime for getForecast
