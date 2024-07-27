import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const CustomAccordion = ({ items }: { items: Array<string> }) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Scanned list</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
        {items.map((item, index) => (
          <AccordionContent key={index}>{item}</AccordionContent>
        ))}
      </AccordionItem>
    </Accordion>
  );
};

export default CustomAccordion;
