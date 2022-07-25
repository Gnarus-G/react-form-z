import { useCallback, useMemo, useState } from "react";
import { z, ZodType } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BasicForm = Record<string, any>;

type RequiredInputProps = Pick<
  JSX.IntrinsicElements["input"],
  "onChange" | "value" | "name"
>;

type OnSubmitHanlder<T> = (values: T) => void;

interface Form<T extends BasicForm> {
  values: T;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  onSubmit: (handler: OnSubmitHanlder<T>) => (event: React.FormEvent) => void;
  bind: (name: keyof T) => RequiredInputProps;
}

export function useForm<T extends BasicForm>(
  schemaDef: (zod: typeof z) => ZodType<T>,
  initial: T
): Form<T> {
  const _ = useMemo(() => schemaDef(z), [schemaDef]);
  const [values, setValues] = useState(initial);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => {
        const next = {
          ...prev,
          [event.target.name]: event.target.value,
        };
        return next;
      });
    },
    []
  );

  return {
    values,
    setValues,
    onSubmit: useCallback(
      (handler) => (event) => {
        event.preventDefault();
        handler(values);
      },
      [values]
    ),
    bind: useCallback(
      (name) => {
        return {
          name: name as string,
          value: values[name],
          onChange: handleChange,
        };
      },
      [values, handleChange]
    ),
  };
}
