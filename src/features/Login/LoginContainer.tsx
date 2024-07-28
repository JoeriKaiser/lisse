import React from 'react';
import Login from './Login';

const LoginContainer = () => {
  const handleSubmit = (username: string, password: string) => {
    console.log(username, password);
  };
  return (
    <>
      <Login handleSubmit={handleSubmit} />
    </>
  );
};

export default LoginContainer;
