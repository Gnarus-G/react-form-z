import {
  ChangeEvent,
  createElement,
  FormEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { z, ZodTypeAny } from "zod";

type InputProps = JSX.IntrinsicElements["input"];

type InputComponent = React.ComponentType<InputProps>;

type HandledInputProps<T> = T extends ZodTypeAny
  ? { name: keyof z.infer<T> } & InputProps
  : InputProps;

export default function createFormHook<I extends InputComponent>(Input: I) {
  const useForm = <T extends ZodTypeAny>(
    schemaDef: (zod: typeof z) => T,
    initial: z.infer<T>
  ) => {
    const _ = useMemo(() => schemaDef(z), [schemaDef]);
    const [values, setValues] = useState(initial);

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) =>
        setValues((prev) => ({
          ...prev,
          [event.target.name]: event.target.value,
        })),
      []
    );

    return [
      {
        values,
        setValues,
        onSubmit: useCallback(
          (handler: (values: typeof initial) => void) => (event: FormEvent) => {
            event.preventDefault();
            handler(values);
          },
          [values]
        ),
      },
      useCallback(
        (props: HandledInputProps<T>) =>
          createElement(Input, {
            ...props,
            onChange: handleChange,
          }),
        [handleChange]
      ),
    ] as const;
  };

  return useForm;
}
