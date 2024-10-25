import * as yup from 'yup';

export interface IFormInputs {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  rememberMe: yup.boolean().oneOf([true], 'Remember me must be checked')
});

export const FormInputs = schema;
