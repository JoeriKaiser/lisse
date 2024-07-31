import { FormInputs, IFormInputs } from './formTypes';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

type Props = {
  onSubmit: (data: IFormInputs) => void;
};

const Register = ({ onSubmit }: Props) => {
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
    <form onSubmit={handleSubmit(triggerSubmit)}>
      <div>
        <label htmlFor="firstname">First Name</label>
        <input id="firstname" {...register('firstname')} />
        {errors.firstname && <p>{errors.firstname.message}</p>}
      </div>
      <div>
        <label htmlFor="lastname">Last Name</label>
        <input id="lastname" {...register('lastname')} />
        {errors.lastname && <p>{errors.lastname.message}</p>}
      </div>
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
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>
      <div>
        <label>
          <input type="checkbox" {...register('agreeToTerms')} />I agree to the terms and conditions
        </label>
        {errors.agreeToTerms && <p>{errors.agreeToTerms.message}</p>}
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
