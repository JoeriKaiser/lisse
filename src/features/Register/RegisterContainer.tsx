import { useRegister } from '../../api/mutations/register';
import { IFormInputs } from './formTypes';
import Register from './Register';

const RegisterContainer = () => {
  const registerUser = useRegister();
  const onSubmit = (inputs: IFormInputs) => {
    registerUser.mutate(inputs, {
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
      <Register onSubmit={onSubmit} />
    </>
  );
};

export default RegisterContainer;
