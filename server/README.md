# trashbot server

## API

### HTTP

#### Ping

Send GET `/ping` to check if the server is online. The server will return 
200 and "pong" if working.

### Socket.io

All messages sent from the server to the client may also be of the form 
`{ errorCode: number }`. Check if the message is an error by checking if it has
an `errorCode` property.

#### Host

A player may open a new room on the server by sending it their name. The server
will create a room with the player as its host. It will then send back the id 
of this room as well as the player's unique id. This id will be used to 
authenticate the player in future exchanges.

Client -> Server `server/host`
```js
{ playerName: string }
```
OK: Server -> Client `me/host`
```js 
{ playerId: number, roomId: number }
```
ERRORS: 
- 0 = Bad player name

#### Join

A player may join an existing room. For this they need to have a name and 
the id of the room they want to join. The server will attempt to add the 
player to the given room. If successful it will send back the unique id of the
joined player.

Client -> Server `server/join`
```js
{ playerName: string, roomId: number }
```
OK: Server -> Client `me/join`
{ playerId: number }
ERRORS:
- 0 = Bad name
- 1 = Room not found
- 2 = Duplicate name
