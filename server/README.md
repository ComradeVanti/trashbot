# trashbot server

## API

### HTTP

#### Ping

Send GET `/ping` to check if the server is online. The server will return 
200 and "pong" if working.

### Socket.io

#### Host

Send `{ "playerName": string }` to `server/host`.  
This will open reserve an id for the player and open a new room.  
If successful receive `{ "playerId": string, "roomId": string }` on `me/host`
