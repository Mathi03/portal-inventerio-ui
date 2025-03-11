import { Select as SelectDefault } from "@telefonica/mistica";
import { SelectProps } from "@telefonica/mistica/dist/select";
export default function Select(props: Omit<SelectProps, "native">) {
  return <SelectDefault {...props} native={true} />;
}
