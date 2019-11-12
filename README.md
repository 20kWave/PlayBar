# 20kWave Active Player Module

This features an animated player synced proportionally with a time-stamped location in a song. Its clickable components include a play/pause toggle button, fastforward/rewind buttons, shuffle/repeat buttons, hover volume control, album thumbnails, and a like button.

## Table of Contents

1. [API](#API)
1. [Requirements](#requirements)
1. [Dependencies](#installing)
1. [Development](#development)

## API
### URL
`localhost:3020/songs/:id`
Dynamically render a user's playlist based on id of the entrypoint url.

### GET
`/song`

| Query Params (required) | Type |
| ----------- | ----------- |
| songId | number |
| userId (optional) | number |

Retrieve a song based on the id.

Response:
```
[
  {
    songId: number,
    length: number,
    timestamp: number,
    isliked: boolean,
    songFile: string,
    title: string,
    artist: string,
    album: string,
    thumbnail: string,
  }
]
```


### POST
`/like`

| Query Params (required) | Type |
| ----------- | ----------- |
| userId | number |
| songId | number |

Add a liked song to user's like list.

### DELETE
`/like`

| Query Params (required) | Type |
| ----------- | ----------- |
| userId | number |
| songId | number |

Unlike a song and delete it from an user's like list. 

### PUT
`/song`

| Query Params (required)| Type |
| ----------- | ----------- |
| songId | number |
| songTitle | string |

Update a song's title.

## Requirements

- Node 6.13.1

## Installing Dependencies

From within the root directory:

```sh
npm install
```

## Development

From within the root directory, do each of the following:

- Run webpack to build bundle.js
```sh
npm run build
```
- Start the server at port 3020
```sh
npm start
```
- Create a copy of config.example.js
- Save the new file as config.js and enter your mysql password or '' if not using a password
- If using a mysql password: 
```sh
npm run db
```
- If not using a mysql password: 
```sh
npm run db-nopassword
```
