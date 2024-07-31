import { useLogin } from '../../api/mutations/login';
import { IFormInputs } from './formTypes';
import Login from './Login';

const LoginContainer = () => {
  const loginUser = useLogin();
  const onSubmit = (inputs: IFormInputs) => {
    loginUser.mutate(inputs, {
      onSuccess: () => {
        console.log('success');
      },
      onError: () => {
        console.log('error');
      }
    });
  };

  return (
    <>
      <Login onSubmit={onSubmit} />
    </>
  );
};

export default LoginContainer;
