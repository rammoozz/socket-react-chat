import React, {Component} from 'react';
import io from 'socket.io-client';
import ReactDOM from 'react-dom'
import update from 'immutability-helper';
import styled, {injectGlobal} from 'styled-components';
import {Heading} from 'rebass';
import ChatWith from './components/ChatWith';
import Users from './components/Users';
var random = require('random-name');

injectGlobal`
body{
  font-family: 'Roboto', sans-serif;
  margin:0;
overflow:hidden;
height:100vh;
}
#root{
height:100%;
}
`;


// USER
const UserLayout = styled.div`cursor: pointer;display:grid;grid-gap:10px;min-width:200px;align-items:center;grid-template-columns:1fr; height:70px;width:50%;`;
const User = ({clientObj, handleClickUser, me}) => {
  const t = clientObj;
  return (
    <UserLayout
      onClick={() => (t.clientId !== me ? handleClickUser(t) : null)}>
      <div style={{margin: 'auto'}}>{t.clientName} </div>
    </UserLayout>
  );
};
// APP LAYOUT
const Layout = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  margin: auto;
  align-items: center;
  justify-content: center;
  grid-template-rows: 100%;
  grid-template-columns: 1fr 1fr;
`;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socketData: null,
      me: null,
      chatWith: null,
      messages: {},
    };
    this.socket = io.connect('http://localhost:8000', {forceNew: true});
  }
  componentDidMount = () => {
    this.socket.emit(
      'ATTEMPT_CONNECT',
      `${random.first()} ${random.first()[0]}.`
    );
    this.socket.on('ACCOUNT_CREATED', this.onCreated);
    this.socket.on('PRIVATE_MESSAGE', this.onPrivateMessage);
    this.socket.on('SET_ACCOUNT_ID', this.onSetAccountId);
    this.socket.on('USER_DISCONNECT', this.onUserDisconnect);
  };
  onCreated = socketData => {
    this.setState({
      socketData,
    });
  };
  onUserDisconnect = connectedClients => {
    const currentState = this.state.socketData;
    const newState = update(currentState, {
      connectedClients: {$set: connectedClients},
    });
    this.setState({
      socketData: newState,
    });
  };
  onSetAccountId = me => {
    console.log(me);
    this.setState({
      me,
    });
  };
  onPrivateMessage = messages => {
    const currentState = this.state.messages;
    const newState = update(currentState, {$set: messages});
    this.setState({
      messages: newState,
    });
  };
  onChatWithUser = chatWithObj => {
    this.setState({
      chatWith: chatWithObj.clientId,
      chatWithObj,
    });

  };

  onSubmit = (formData) =>{
        this.socket.emit('CHAT_WITH', {
      msg: formData,
      to: this.state.chatWithObj.clientId,
      me: this.state.me
    });

  }
  render() {
    const {socketData, chatWithObj, me, messages, chatWith} = this.state;
    const {onChatWithUser,onSubmit,onInputChange} = this;
    return (
      <Layout>
        <Users
          me={me}
          chatWith={chatWith}
          handleClickUser={onChatWithUser}
          socketData={socketData}
        />
        {chatWithObj ? (
          <ChatWith onInputChange={onInputChange} onSubmit={onSubmit} messages={messages[chatWith]} chatWithObj={chatWithObj} />
        ) : <div style={{width:'100%',height:'100%',background:'#ecf0f1'}}></div>}
      </Layout>
    );
  }
}

export default App;
