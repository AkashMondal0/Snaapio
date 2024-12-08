![Logo](/public/skylight%20github%20banner.jpg)

# Snaapio Android App Overview

This repository has a React Native application and a full social media
application backend made with NestJS. For social networking functions like user
administration, post interactions, and authentication, the backend provides a
robust API. For users to interact with the social networking platform, the
client-side application offers a simple and responsive interface.

## Table of Contents

1. [Client - React Native](#client---nextjs)
   - [Tech Stack](#tech-stack)
   - [Features](#features)
   - [Run Locally](#run-locally)
   - [Environment Variables](#environment-variables)
   - [Running the Application](#running-the-application)
2. [Technologies Used](#technologies-used)
3. [Contributing](#contributing)
4. [Feedback](#feedback)
5. [Screenshots](#screenshots)

## Client - React Native - Expo

- `@hookform/resolvers`: Resolvers for `react-hook-form`.
- `@reduxjs/toolkit`: Redux toolkit for state management.
- `@supabase/supabase-js`: Supabase client library.
- `lucide-react`: Icon library for React.
- `react-hook-form`: Forms library for React.
- `react-redux`: Official React bindings for Redux.
- `socket.io-client`: Real-time bidirectional event-based communication.
- `zod`: TypeScript-first schema declaration and validation library.

## Tech Stack

React Native, Redux toolkit, react-hook-form, socket io, zod

## Features

- User authentication with JWT and NextAuth.js.
- Real time chat using Socket io.
- Image uploading feature.
- Share Photo with your friends.
- Light and dark modes Toggle and switch themes.
- ChatBot: Ask Google Gemini AI anything.

## Run Locally

Clone the project

```bash
git clone https://github.com/AkashMondal0/Snaapio.git
```

Go to the project directory

```bash
cd Snaapio
```

Install dependencies

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the `client` directory and configure the necessary
environment variables:

```env
# supabase config
EXPO_PUBLIC_SUPABASE_URL=supabaseUrl
EXPO_PUBLIC_SUPABASE_ANON_KEY=
# user config
EXPO_PUBLIC_SUPABASE_STORAGE_URL=supabaseUrl + /storage/v1/object/public/
EXPO_PUBLIC_SERVER_URL=http://192.168.31.232:5000/v1
EXPO_PUBLIC_AI_API_URL=supabaseUrl + /functions/v1/generative
```

### Server - Docker Image

To run this project, you will need to add the following environment variables to
your .env file

### The Server Application

To Start The Docker Container:

```bash
docker compose up
```

## Screenshots

![App Screenshot](/public/2.jpg)

![App Screenshot](/public/1.jpg)

## Themes

![App Screenshot](/public/skylight%20theme.jpg)
