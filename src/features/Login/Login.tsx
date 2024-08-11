import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FormInputs, IFormInputs } from './formTypes';

type Props = {
  onSubmit: (data: IFormInputs) => void;
};

const Login = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormInputs>({
    resolver: yupResolver(FormInputs)
  });

  const triggerSubmit = (data: IFormInputs) => {
    onSubmit(data);
  };

  return (
    <>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit(triggerSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register('password')} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
