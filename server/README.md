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

In some special cases the server will also send errors to `me/error`. The
codes/situations for this are:

- 0 = You attempted to send a message to a non-existent room

#### Host

A player may open a new room on the server by sending it their name. The server
will create a room with the player as its host. It will then send back the id
of this room as well as the player's unique id. This id will be used to
authenticate the player in future exchanges.

Client -> Server `server/host`

```js
{
    playerName: string
}
```

OK: Server -> Client `me/host`

```js 
{
    playerId: number, 
    roomId: number
}
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
{
    playerName: string,
    roomId: number
}
```

OK: Server -> Client `me/join`

```js
{
    playerId: number,
    playersInLobby: [  { id: number, name: string } ]
}
```

ERRORS:

- 0 = Bad name
- 1 = Duplicate name
- 2 = Room is not in the lobby-state
- 3 = Room does not exist

#### Get actors

Get all actors around the player. Send the id of the player and their
location to the server. Server responds with array of actors.

An actor is either a player or item, which can be differentiated by their
`type` property.

- 0 = player
- 1 = item

Client -> Server `[roomId]/get-actors`

```js
{
    playerId: number, 
    location: { lat: number, lng: number }
}
```

Server -> Client `me/actors`

```js
{
    actors: [
        {
            type: 0,
            id: playerId,
            location: {lat: number, lng: number}
        }
    ]
}
```

Error:

- 0 = Player is not part of room
