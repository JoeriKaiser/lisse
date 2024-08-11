import { useLogin } from '../../api/mutations/login';
import { useAuth } from '../../context/AuthContext';
import { IFormInputs } from './formTypes';
import Login from './Login';

const LoginContainer = () => {
  const { setUser } = useAuth();
  const loginUser = useLogin();
  const onSubmit = (inputs: IFormInputs) => {
    loginUser.mutate(inputs, {
      onSuccess: (data) => {
        setUser(data);
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
