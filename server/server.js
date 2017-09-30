var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var Hashids = require('hashids');
var hashids = new Hashids();
var app = express();
var server = http.Server(app);
var websocket = socketio(server);
var _ = require('underscore');

const ATTEMPT_CONNECT = 'ATTEMPT_CONNECT';
const ACCOUNT_CREATED = 'ACCOUNT_CREATED';
const USER_DISCONNECT = 'USER_DISCONNECT';
const CHAT_WITH = 'CHAT_WITH';
const BUZZ = 'BUZZ';
const STOP_BUZZ = 'STOP_BUZZ';
const PRIVATE_MESSAGE = 'PRIVATE_MESSAGE';
const SET_ACCOUNT_ID = 'SET_ACCOUNT_ID';
const defaultImageUrl = 'http://placekitten.com/g/250/250';
let connectedClients = [];

server.listen(8000, () => console.log('listening on *:8000'));
findDisconnectedId = (clients, clientId) => {
  connectedClients = _.reject(connectedClients, el => {
    return el.clientId === clientId;
  });
  websocket.emit(USER_DISCONNECT, connectedClients);
};
onChatWith = (chatWithObj, socket) => {
  const to = chatWithObj.to;
  const msg = chatWithObj.msg;
  const from = chatWithObj.me;
  addMessageToClientArchive(to, msg, from);
};
addMessageToClientArchive = (to, msg, from) => {
  const time = new Date();
  const message = {msg, time,to,from}

  //buzz//
  if(msg.includes('<buzz>')){
    websocket.to(to).emit(BUZZ, from);
    websocket.to(from).emit(BUZZ, to);
  }
  if(msg.includes('</buzz>')){
    websocket.to(to).emit(STOP_BUZZ, from);
    websocket.to(from).emit(STOP_BUZZ, to);
  }

  connectedClients.map(client => {
    if (client.clientId === from) {
      if (client.messages[to] && client.messages[to]!== undefined && Array.isArray(client.messages[to])) {
        client.messages[to].push(message);
      } else {
        client.messages[to] = [message];
      }
      websocket.to(from).emit(PRIVATE_MESSAGE, client.messages);
    }
    if (client.clientId === to) {
      if (client.messages[from] && client.messages[from]!== undefined && Array.isArray(client.messages[from])) {
        client.messages[from].push(message);
      } else {
        client.messages[from] = [message];
      }
      websocket.to(to).emit(PRIVATE_MESSAGE, client.messages);
    }
  });
};

onConnection = socket => {
  socket.on(ATTEMPT_CONNECT, clientName => {
    createAccount(socket, socket.id, clientName);
  });
  console.log('a user connected', connectedClients);
  socket.on('disconnect', () => {
    findDisconnectedId(connectedClients, socket.id);
  });
  socket.on(CHAT_WITH, onChatWith);
  
};
createAccount = (socket, clientId, clientName) => {
  console.log('CREATE_ACCOUNT', clientId, clientName);
  const newAccountObj = Object.assign(
    {},
    {
      clientName,
      joinDate: new Date(),
      imageUrl: defaultImageUrl,
      clientId,
      isConnected: socket['connected'],
      messages: {},
    }
  );
  connectedClients.push(newAccountObj);
  console.log(
    `New User -  ${newAccountObj.clientId} Created, ${connectedClients.length} active users`
  );
  websocket.to(clientId).emit(SET_ACCOUNT_ID, clientId);
  websocket.emit(ACCOUNT_CREATED, {connectedClients, newAccountObj});
};
websocket.on('connection', onConnection);
