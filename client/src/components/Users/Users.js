import React, {Component} from 'react';
import {Heading} from 'rebass'
import User from '../User'
import styled, {injectGlobal} from 'styled-components';

// USERS
const UsersLayout = styled.div`
  display: grid;
  background: white;
  height: 100%;
  width: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: 30px 1fr;
  justify-content: center;
`;
export const Users = ({socketData, handleClickUser, me,chatWith}) => {
  return (
    <UsersLayout>
      <Heading
        style={{fontSize: 30, margin: 'auto', borderBottom: '1px solid grey'}}
      >
        Users
      </Heading>
      <div
        style={{display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start'}}
      >
        {socketData &&
          socketData.connectedClients &&
          socketData.connectedClients.map((clientObj, l) => {
            if (clientObj.clientId !== me) {
              return (
                <div key={l} style={{margin: '20px 10px'}}>
                  <User
                  chattingWith={clientObj.clientId === chatWith}
                    me={me}
                    key={l}
                    clientObj={clientObj}
                    handleClickUser={handleClickUser}
                  />
                </div>
              );
            }
          })}
      </div>
    </UsersLayout>
  );
};