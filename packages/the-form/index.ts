import {
  ChangeEvent,
  createContext,
  createElement,
  FormEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { z, ZodTypeAny } from "zod";

type InputProps = JSX.IntrinsicElements["input"];

type Field = React.ComponentType<InputProps> | "input";

type HandledInputProps<T> = T extends ZodTypeAny
  ? { name: keyof z.infer<T> } & InputProps
  : InputProps;

export default function create<C extends Field>() {
  const context = createContext<C>(null);

  const useForm = <T extends ZodTypeAny>(
    schemaDef: (zod: typeof z) => T,
    initial: z.infer<T>
  ) => {
    const _ = useMemo(() => schemaDef(z), []);
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
          createElement(useContext(context), {
            ...props,
            onChange: handleChange,
          }),
        []
      ),
    ] as const;
  };

  return [context.Provider, useForm] as const;
}
