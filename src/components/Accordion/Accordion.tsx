import { Result } from '@zxing/library';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const CustomAccordion = ({ items }: { items: Array<Result> }) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Scanned list</AccordionTrigger>
        {items.map((item, index) => (
          <AccordionContent key={index}>{JSON.stringify(item)}</AccordionContent>
        ))}
      </AccordionItem>
    </Accordion>
  );
};

export default CustomAccordion;
