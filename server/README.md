# trashbot server

## API

### HTTP

#### Ping

Send GET `/ping` to check if the server is online. The server will return 
200 and "pong" if working.

### Socket.io

#### Host

Send a message of the form 
```json
{
  "playerName": string
}
```
to `server/host` to open a new room with a player with the given name as host.
You will receive a message of the form
```json
{
  "playerId": string,
  "roomId": string
}
```
