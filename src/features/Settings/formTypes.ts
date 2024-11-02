import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  url: yup.string().url('Must be a valid URL').required('URL is required'),
  authMethod: yup.string().required('Auth method is required'),
  authValue: yup.string().required('Auth value is required'),
  customHeaders: yup.string().test('is-json', 'Must be valid JSON', (value) => {
    if (!value) return true;
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }),
  isActive: yup.boolean()
});

export const FormInputs = schema;
