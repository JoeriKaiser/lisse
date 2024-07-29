import { IFormInputs } from './formTypes';
import Login from './Login';

const LoginContainer = () => {
  const onSubmit = (inputs: IFormInputs) => {
    console.log(inputs);
  };

  return (
    <>
      <Login onSubmit={onSubmit} />
    </>
  );
};

export default LoginContainer;