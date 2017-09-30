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
  };
  onSubmit = () => {
    this.setState({
      formValue: '',
    });
    this.props.onSubmit(this.state.formValue);
  };
  render() {
    const {formValue} = this.props;
    return (
      <div style={{display: 'flex', width: '100%'}}>
        <input
          style={{
            border: '5px solid #ecf0f1',
            flex: 1,
            background: 'white',
            color: 'black',
          }}
          value={this.state.formValue}
          onChange={this.onInputChange}
        />
        <Button
          style={{
            background: '#27ae60',
            marginBottom: 10,
            marginRight: 20,
            marginLeft: 20,
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            width: 50,
            height: 50,
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
  grid-template-rows: 50px 1fr 50px;
`;
export const ChatWith = ({
  chatWithObj,
  messages,
  onSubmit,
  onInputChange,
  formValue,
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
              <div
                style={{
                  gridTemplateRows: '1fr',
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr'
                }}
                key={l}
              >
                {' '}
                <Moment format="YYYY/MM/DD  HH:mm">{msg.time}</Moment>{' '}
                <span style={{}}>{msg.msg}</span>
              </div>
            );
          })}
      </div>
      <div style={{display: 'flex'}}>
        <MyInput onSubmit={onSubmit} />
      </div>
    </ChatWithLayout>
  );
};
