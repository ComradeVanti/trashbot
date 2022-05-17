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

Client -> Server `{ playerName: string }` to `server/host`.  

OK: Server <- Client `{ "playerId": number, "roomId": number }` on `me/host`

ERRORS: 
- 0 = Bad player name

