import { FormEvent, useCallback, useMemo, useState } from "react";
import { z, ZodError, ZodType } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BasicForm = Record<string, any>;

type InputValue = JSX.IntrinsicElements["input"]["value"];
type OnInputChange = JSX.IntrinsicElements["input"]["onChange"];

type HasValue<V extends InputValue> = { value?: V };

type RequiredInputProps = {
  name?: string;
  value?: InputValue;
  onChange?: OnInputChange;
  error?: React.ReactNode;
};

type InferredInputProps<Props> = {
  value?: Props extends HasValue<infer V> ? V : unknown;
} & Props;

type OnSubmitHanlder<T> = (values: T, event: FormEvent) => void;

type Errors<T> = Partial<Record<keyof T, React.ReactNode>>;

interface Form<T extends BasicForm, E = Errors<T>> {
  values: T;
  errors: E;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  setErrors: React.Dispatch<React.SetStateAction<E>>;
  onSubmit: (handler: OnSubmitHanlder<T>) => (event: React.FormEvent) => void;
}

type FormArgs<T extends BasicForm> = {
  schema: (zod: typeof z) => ZodType<T>;
  initial: T;
  initialErrors?: Errors<T>;
};

export function useForm<T extends BasicForm>({
  schema: schemaDef,
  initial,
  initialErrors = {},
}: FormArgs<T>): Form<T> {
  const schema = useMemo(() => schemaDef(z), [schemaDef]);
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState(initialErrors);

  const validate = useCallback(
    async (onSuccess: (data: T) => void) => {
      return schema
        .parseAsync(values)
        .then(onSuccess)
        .catch((e: ZodError<T>) => {
          const errors = e.flatten().fieldErrors;
          setErrors(errors as Errors<T>);
        });
    },
    [schema, values]
  );

  return {
    values,
    errors,
    setValues,
    setErrors,
    onSubmit: useCallback(
      (handler) => async (event) => {
        event.preventDefault();
        await validate((data) => handler(data, event));
      },
      [validate]
    ),
  };
}

type FormBinding<FormData> = [
  Pick<Form<FormData>, "values" | "setValues" | "errors">,
  keyof FormData
];

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
      for: [{ values, setValues, errors }, name],
      ...rest
    } = props;

    return (
      <Input
        name={name}
        value={values[name]}
        error={errors[name]}
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
