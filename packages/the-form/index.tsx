import { useCallback, useMemo, useState } from "react";
import { z, ZodType } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BasicForm = Record<string, any>;

type InputValue = JSX.IntrinsicElements["input"]["value"];
type OnInputChange = JSX.IntrinsicElements["input"]["onChange"];

type HasValue<V extends InputValue> = { value?: V };

type RequiredInputProps = {
  name?: string;
  value?: InputValue;
  onChange?: OnInputChange;
};

type InferredInputProps<Props> = {
  name?: string;
  value?: Props extends HasValue<infer V> ? V : unknown;
  onChange?: JSX.IntrinsicElements["input"]["onChange"];
} & Props;

type OnSubmitHanlder<T> = (values: T) => void;

interface Form<T extends BasicForm> {
  values: T;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  onSubmit: (handler: OnSubmitHanlder<T>) => (event: React.FormEvent) => void;
}

export function useForm<T extends BasicForm>(
  schemaDef: (zod: typeof z) => ZodType<T>,
  initial: T
): Form<T> {
  const _ = useMemo(() => schemaDef(z), [schemaDef]);
  const [values, setValues] = useState(initial);

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
  };
}

type FormBinding<FormData> = [Form<FormData>, keyof FormData];

type PropsWithFormBinding<Props, FormData> = Props & {
  for: FormBinding<FormData>;
};

export function createFormInput<
  P extends RequiredInputProps,
  Props = InferredInputProps<P>
>(Input: React.ComponentType<Props>) {
  return function FormInput<FormData>(
    props: PropsWithFormBinding<Props, FormData>
  ) {
    const {
      for: [{ values, setValues }, name],
      ...rest
    } = props;

    return (
      <Input
        name={name}
        value={values[name]}
        onChange={useCallback(
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues((prev) => ({
              ...prev,
              [name]: event.target.value,
            }));
          },
          [name, setValues]
        )}
        {...(rest as unknown as Props)}
      />
    );
  };
}
