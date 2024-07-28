import React, { useState } from 'react';

type Props = {
  handleSubmit: (username: string, password: string) => void;
};

const Login = ({ handleSubmit }: Props) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const triggerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(username, password);
  };

  return (
    <>
      <h1>Sign in</h1>
      <form onSubmit={triggerSubmit}>
        <section>
          <label htmlFor="username">Username</label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            name="username"
            type="text"
            required
          />
        </section>
        <section>
          <label htmlFor="current-password">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            id="current-password"
            name="password"
            type="password"
          />
        </section>
        <button type="submit">Sign in</button>
      </form>
    </>
  );
};

export default Login;
