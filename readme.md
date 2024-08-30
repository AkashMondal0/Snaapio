
![Logo](/public/Sky%20Chat%20app.png)


# Sky Chat Android App

This is a real-time chat application developed using Expo React Native and Nodejs. It has features like WhatsApp, Realtime Chat, Push messages, upload status, and share photos with your friends.

## Tech Stack

**Client:** React Native Expo, Redux toolkit, react-hook-form

**Server:** Node, Express, kafkajs, mongoose, socket.io, zod, ioredis, multer

**Database:** Redis (pub/sub), MongoDB 


## Features

- User authentication with JWT and bcrypt
- Real-time chat using Socket io
- Image uploading feature with Multer
- Share your Status with your friends
- Light/dark mode toggle
- Group chat feature

## Screenshot

![App Screenshot](/public/sky%20chat.png)
<!-- ![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here) -->


## Run Locally

Clone the project

```bash
  git clone https://github.com/AkashMondal0/Sky-Chat-App-Expo.git
```

Go to the project directory

```bash
  cd Sky-Chat-App-Expo
```

Install dependencies

```bash
  npm install
```

Start the app development mode

```bash
  npm npx expo start
```

build app for start app

```bash
  eas build -p android --profile preview
```

## Variables

To run this project, you will need to add the following variables to your `keys.ts` file

`1. Change IP address to your local IP address (192.168.31.212)`

`localhost`

`localhostStorage`



## Set up backend

Docker  is required to set up a local instance of MongoDB and Redis. You can download it from [here](https://www.docker.com/).

1. Install all required docker images  by running `docker-compose up -d` in the root folder of this repository.

```bash
docker-compose up -d
```

## Expo Server running  on 
`http://localhost:8081`
## Server API running on 
`http://localhost:4000`
## Storage Server  running on 
`http://localhost:4001`

## Backend GitHub repository

backend repository link : [https://github.com/AkashMondal0/sky-chat-backend.git](https://github.com/AkashMondal0/sky-chat-backend.git)

Storage repository link : [https://github.com/AkashMondal0/skyinc-storage.git](https://github.com/AkashMondal0/skyinc-storage.git)

## Feedback

If you have any feedback, please reach out to us at akash2003mondal@gmail.com

