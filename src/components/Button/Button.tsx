import { Button } from '../ui/button';

const CustomButton = ({ textonPress }: { text: string; onPress: () => void }) => {
  return <Button>{text}</Button>;
};

export default CustomButton;
