import { Button } from '../ui/button';

const CustomButton = ({ text, onPress }: { text: string; onPress: () => void }) => {
  return <Button onClick={onPress}>{text}</Button>;
};

export default CustomButton;
