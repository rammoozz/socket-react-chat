import React, {Component} from 'react';
import io from 'socket.io-client';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';
import styled, {injectGlobal} from 'styled-components';
import {Heading, Button} from 'rebass';

import Moment from 'react-moment';
class MyInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {formValue: ''};
  }
  onInputChange = e => {
    this.setState({
      formValue: e.target.value,
    });
    if (e.charCode === 13) {
      this.onSubmit();
    }
  };
  onBuzz = () =>{
    const {isBuzzing} = this.props
     if(isBuzzing){
      this.props.onSubmit('</buzz>');
     }else{
       this.props.onSubmit('<buzz>');
     }
  }
  onSubmit = () => {
    if (this.state.formValue !== '' && this.state.formValue !== null) {
      this.props.onSubmit(this.state.formValue);
      this.setState({
        formValue: '',
      });
    }
  };

  render() {
    const {formValue, closeChatWith,isBuzzing} = this.props;
    return (
      <div style={{display: 'flex', width: '100%'}}>
        {/*<div onClick={closeChatWith}>x</div>*/}
        <input
          style={{
            border: '5px solid #ecf0f1',
            flex: 1,
            background: 'white',
            color: 'black',
          }}
          value={this.state.formValue}
          onKeyPress={this.onInputChange}
          onChange={this.onInputChange}
        />
         <Button
          style={{
            background: isBuzzing? '#3498db' : 'tomato',
            marginBottom: 10,
            marginRight: 20,
            marginLeft: 20,
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            width: 100,
            height: 100,
            borderRadius: '50%',
          }}
          onClick={this.onBuzz}
        >
          <div style={{margin: 'auto'}}>{isBuzzing ? "unBuzz" : "Buzz"}</div>
        </Button>
        <Button
          style={{
            background: '#27ae60',
            marginBottom: 10,
            marginRight: 20,
            marginLeft: 20,
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            width: 100,
            height: 100,
            borderRadius: '50%',
          }}
          onClick={this.onSubmit}
        >
          <div style={{margin: 'auto'}}>Send</div>
        </Button>
      </div>
    );
  }
}
// CHAT WITH
const ChatWithLayout = styled.div`
  display: grid;
  background: #ecf0f1;
  padding: 20px;
  height: calc(100% - 40px);
  width: calc(100% - 40px);
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr 100px;
`;
export const ChatWith = ({
  chatWithObj,
  messages,
  onSubmit,
  formValue,
  isBuzzing,
  me,
}) => {
  const {clientName, imageUrl} = chatWithObj;
  return (
    <ChatWithLayout>
      <Heading
        style={{
          fontSize: 30,
          margin: 'auto',
          borderBottom: '1px solid grey',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <img
          alt="foo"
          style={{width: 50, height: 50, borderRadius: '50%'}}
          src={imageUrl}
        />
        <div>&nbsp;{clientName}</div>
      </Heading>
      <div style={{padding: 10}}>
        {messages &&
          messages.map((msg, l) => {
            return (
              <div style={{display: 'flex'}} key={l}>
                {msg.from === me ? (
                  <div style={{display: 'flex', width: '100%'}}>
                    <span
                      style={{
                        display: 'flex',
                        flex: '0 0 30%',
                      }}
                    >
                      <Moment format="YYYY/MM/DD  HH:mm">{msg.time}</Moment>
                    </span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        flex: '0 0 60%',
                        fontWeight: 'bold',
                        fontSize: 15,
                      }}
                    >
                      {msg.msg}
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                    }}
                  >
                    <span
                      style={{
                        flex: '0 0 30%',
                        fontWeight: 'bold',
                        fontSize: 15,
                      }}
                    >
                      {msg.msg}
                    </span>
                    <span style={{marginLeft: 'auto', flex: '0 0 60%'}}>
                      <Moment format="YYYY/MM/DD  HH:mm">{msg.time}</Moment>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div style={{display: 'flex'}}>
        <MyInput isBuzzing={isBuzzing} onSubmit={onSubmit} />
      </div>
    </ChatWithLayout>
  );
};
