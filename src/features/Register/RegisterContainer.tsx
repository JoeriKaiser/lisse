import { IFormInputs } from './formTypes';
import Register from './Register';

const RegisterContainer = () => {
  const onSubmit = (inputs: IFormInputs) => {
    console.log(inputs);
  };

  return (
    <>
      <Register onSubmit={onSubmit} />
    </>
  );
};

export default RegisterContainer;
