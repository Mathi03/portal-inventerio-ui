import Button from '@/components/Button';
import Icon from '@/components/Icon';

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Checkbox, Form, FormValues } from '@telefonica/mistica';

export default function ShowColumns({
  showColumn,
  onSubmit,
  columnsToExport,
}: {
  showColumn?: FormValues;
  onSubmit: (values: any) => void;
  columnsToExport;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <Button variant="link" StartIcon={() => <Icon icon="table_eye" />}>
            Columnas
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] bg-[white] rounded-[24px]">
        <Form
          onSubmit={onSubmit}
          className="grid grid-cols-2 gap-4"
          initialValues={{ ...showColumn }}
        >
          <header className="flex justify-between items-center border-b-[1px] border-[#D1D5E4] py-4 col-span-2">
            <h3 className="text-[24px]">Columnas a mostrar</h3>
            <Button
              variant="primary"
              StartIcon={() => <Icon icon="table_eye" />}
            >
              Aplicar
            </Button>
          </header>
          <p className="col-span-2 text-base">
            Selecciones los campos que quieres mostrar en la tabla
          </p>
          {
            columnsToExport.map(({ text, name }) => {
              return <Checkbox key={name} name={ name }>{ text }</Checkbox>;
            })
          }
        </Form>
      </PopoverContent>
    </Popover>
  );
}
