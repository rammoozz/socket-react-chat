import React, {Component} from 'react';

import styled, {injectGlobal} from 'styled-components';

import {Heading} from 'rebass';

const Circle = styled.div`
  width: 50px;
  height: 50px;
  transition:.2s ease all;
  margin: auto;
  background: ${p => p.chattingWith ? '#2980b9' : '#27ae60'};
  border-radius: 50%;
`;
// USER
const UserLayout = styled.div`cursor: pointer;`;
export const User = ({clientObj, handleClickUser, me,chattingWith}) => {
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
      <Circle chattingWith={chattingWith} />
      <div style={{margin: 'auto',fontWeight:chattingWith && 'bold',transform:chattingWith && 'scale(1.2)',transition:'0.2s all ease'}}>{t.clientName} </div>
    </UserLayout>
  );
};