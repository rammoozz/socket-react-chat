import React, {Component} from 'react';

import {Heading} from 'rebass';
import styled, { keyframes } from 'styled-components';
import { bounce } from 'react-animations';

const animation = keyframes`${bounce}`;

const Circle = styled.div`
  width: 50px;
  height: 50px;
  transition:.2s ease all;
  margin: auto;
  background: ${p => p.chattingWith ? '#2980b9' : '#27ae60'};
  border-radius: 50%;
  animation: ${p => p.isBuzzing ? `1s ${animation} alternate infinite` : null};
`;
// USER
const UserLayout = styled.div`cursor: pointer;`;
export const User = ({clientObj, handleClickUser, me,chattingWith,isBuzzing}) => {
  const t = clientObj;
  return (
    <UserLayout
      onClick={() => (t.clientId !== me ? handleClickUser(t) : null)}
      style={{
        gridGap: 10,
        display: 'grid',
        width: '50%',
        minWidth: 200,
        height: 70,
        gridTemplateColumns: '1fr',
        alignItems: 'center',
      }}
    >
      <Circle isBuzzing={isBuzzing} chattingWith={chattingWith} />
      <div style={{margin: 'auto',fontWeight:chattingWith && 'bold',transform:chattingWith && 'scale(1.2)',transition:'0.2s all ease'}}>{t.clientName} </div>
    </UserLayout>
  );
};