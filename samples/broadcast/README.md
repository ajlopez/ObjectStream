# Broadcast Sample

A server broadcast an object to all connected clients.

## Setup

Execute at command line:
```
npm install
```

## Run

Launch the server:
```
node server [-p|--port portnumber]
```
Example:
```
node server 8000
```
The default port is `3000`.

In other terminal, run a client:
```
node client [message] [-h|--host hostname] [-p|--port portnumber] [-t|--timeout timeout]
```
Examples:
```
node client "Hello" --host localhost --port 3000
node client "I'm a client" --host myserver --port 8000
node client
```
The default message is the classical `Hello, world`. The default port is `3000`. The default host name is `localhost`.

Each client sends an object to the server, with a message and the current date/time, and it is repeated at the specified
timeout (in milliseconds). The default timeout is `1000` milliseconds.
