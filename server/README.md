# trashbot server

## API

### HTTP

#### Ping

Send GET `/ping` to check if the server is online. The server will return
200 and "pong" if working.

### Socket.io

If the server encountered a problem while evaluating your message it will 
send an error to `me/error`. These messages will be of the form:
```js
{ event: string, errorCode: number }
```

where `event` is the name of the event that you sent the server and 
`errorCode`is an integer indicating what went wrong. Codes 0 - 9 are 
reserved for universal errors, while codes 10 and up are related to the 
specific message you sent.

UNIVERSAL ERROR CODES:
- 0 = Room does not exist
- 1 = Player does not exist
- 2 = Player does not have permission for this action
- 3 = Player does not have access to the room
- 4 = The message was missing some important property
- 5 = Item does not exist

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

- 10 = Bad player name

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

```js
{ playerId: number }
```

ERRORS:

- 10 = Bad name
- 11 = Duplicate name

#### Lobby changed

Sent to the client if the lobby changes.

Server -> Client `lobby/changed`

```js
{ playerId: number, action: "JOINED" | "LEFT" }
```

#### Players in lobby

Send this to the server to get all the players which are currently in the lobby.

Client -> Server `lobby/players`

```js
{ playerId: number, roomId: number }
```

Server -> Client `lobby/players`

```js
{ players: { id: number, name: string }[] }
```

#### Lobby ready

Sent from host to server to indicate that all players have joined and the 
room is now ready to choose a rule-set. The server will send a message to 
all players in the room, notifying them of this event, so that they can 
transition to the rule-set page.

Client -> Server `lobby/ready`

```js
{ playerId: number; roomId: number, location: {lat: number, lng: number} }
```

Server -> Client `lobby/ready`

```js
{}
```

It will also send the following to the host to indicate that the timer 
should start and how many minutes the game will last:

Server -> Client `game/start`

```js
{ minutes: number }
```

#### Send player location

Send the player's location to the server, so it can store it. The server 
will respond with all items the player is in range to pick-up

Client -> Server `game/location`

```js
{ playerId: number, roomId: number, location: {lat: number, lng: number}}
```

Server -> Client `me/items-in-range`

```js
{
    id: number,
    type: number
    stats: Object
}[]
```

#### Pick up item

Send the id of an item to the server to pick it up.

Client -> Server `game/pick-up-item`

```js
{ playerId: number, roomId: number, itemId: number }
```

If successful the server will not answer.

ERRORS

- 10 = You are not in range to pick up this item

#### Get actors

Get all actors around the player. Server responds with array of players and items.

Client -> Server `game/get-actors`

```js
{
    playerId: number, 
    roomId: number
}
```

Server -> Client `me/actors`

```js
{
    players: [
        {
            id: number,
            location: {lat: number, lng: number}
        }
    ],
    items: [
        {
            id: number,
            location: {lat: number, lng: number}
        }
    ]
}
```

#### Get robot info

Get the current robot for a player.

Client -> Server `game/robot`

```js
{ playerId: number, roomId: number }
```

Server -> Client `me/robot`

```js
{ robot: Object }
```

#### Game end

The server keeps track of the game time. Once it is over, it will send this 
message to all players to indicate to move to the results page.

Server -> Clients `game/done`

```js
{}
```
