import {
  ChangeEvent,
  createElement,
  FormEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { z, ZodTypeAny } from "zod";

interface RequiredInputProps
  extends Pick<JSX.IntrinsicElements["input"], "onChange" | "value" | "name"> {
  error?: ReactNode;
}

type InputComponent<P> = React.ComponentType<P & RequiredInputProps>;

type HandledInputProps<T, P> = T extends ZodTypeAny
  ? { name: keyof z.infer<T> } & P
  : P;

export default function createFormHook<P>(Input: InputComponent<P>) {
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
        (props: HandledInputProps<T, P>) =>
          createElement(Input, {
            ...props,
            name: props.name as string,
            onChange: handleChange,
          }),
        [handleChange]
      ),
    ] as const;
  };

  return useForm;
}
