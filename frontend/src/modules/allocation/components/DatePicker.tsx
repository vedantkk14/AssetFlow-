import { Input } from '@/components/ui/input';
import type { ComponentProps } from 'react';

// Lightweight native date input, styled consistently with the rest of the
// form fields. Avoids pulling in a calendar/popover dependency for a
// hackathon-scale ERP form.
const DatePicker = (props: ComponentProps<typeof Input>) => {
  return <Input type="date" {...props} />;
};

export default DatePicker;
