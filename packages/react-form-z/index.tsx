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

type OnSubmitHanlder<T> = (values: T, event?: FormEvent) => void;

type Errors<T> = Partial<Record<keyof T, React.ReactNode>>;

interface Form<T extends BasicForm, E = Errors<T>> {
  data: T;
  errors: E;
  setData: React.Dispatch<React.SetStateAction<T>>;
  setErrors: React.Dispatch<React.SetStateAction<E>>;
  onSubmit: (
    handler: OnSubmitHanlder<T>
  ) => (event?: React.FormEvent) => Promise<void>;
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
  const [values, setData] = useState(initial);
  const [errors, setErrors] = useState(initialErrors);

  const validate = useCallback(
    async (onSuccess: (data: T) => void) => {
      setErrors({});
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
    data: values,
    errors,
    setData,
    setErrors,
    onSubmit: useCallback(
      (handler) => async (event) => {
        event?.preventDefault();
        await validate((data) => handler(data, event));
      },
      [validate]
    ),
  };
}

type FormBinding<FormData extends BasicForm> = [
  Pick<Form<FormData>, "data" | "setData" | "errors">,
  keyof FormData
];

type PropsWithFormBinding<Props, FormData extends BasicForm> = Props & {
  for: FormBinding<FormData>;
};

export function createFormInput<
  P extends RequiredInputProps,
  Props = InferredInputProps<P>
>(Input: React.ComponentType<Props>) {
  return function FormInput<FormData extends BasicForm>(
    props: PropsWithFormBinding<Props, FormData>
  ) {
    const {
      for: [{ data, setData, errors }, name],
      ...rest
    } = props;

    return (
      <Input
        name={name}
        value={data[name]}
        error={errors[name]}
        onChange={useCallback(
          (event: React.ChangeEvent<HTMLInputElement>) => {
            setData((prev) => ({
              ...prev,
              [name]: event.target.value,
            }));
          },
          [name, setData]
        )}
        {...(rest as unknown as Props)}
      />
    );
  };
}
