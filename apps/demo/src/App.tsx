import { createFormInput, useForm } from "the-form";
import {
  createTheme,
  TextField,
  TextFieldProps,
  ThemeProvider,
} from "@mui/material";
import { MantineProvider, TextInput } from "@mantine/core";
import "./App.css";

function App() {
  return (
    <>
      <div className="App">
        <FormDemo />
      </div>
      <br />
      <MantineProvider theme={{ colorScheme: "dark" }}>
        <FormMantineDemo />
      </MantineProvider>
      <br />
      <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
        <FormMuiDemo />
      </ThemeProvider>
    </>
  );
}

export default App;

const Input = createFormInput((props) => (
  <>
    <input {...props} />
    <p>{props.error}</p>
  </>
));

function FormDemo() {
  const form = useForm({
    schema: (z) =>
      z.object({
        first: z.string().min(8),
        last: z.string().min(8),
      }),
    initial: { first: "", last: "" },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => console.log("Submitting", values))}
    >
      <Input for={[form, "first"]} />
      <br />
      <br />
      <Input for={[form, "last"]} />
      <pre>{JSON.stringify(form.values, null, 2)}</pre>
      <button
        className="btn clear"
        type="button"
        onClick={() => form.setValues({ first: "", last: "" })}
      >
        Clear
      </button>
      <button>Submit</button>
    </form>
  );
}

const MantineInput = createFormInput(TextInput);

function FormMantineDemo() {
  const form = useForm({
    schema: (z) =>
      z.object({
        first: z.string().min(8),
        last: z.string().min(8),
      }),
    initial: { first: "", last: "" },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => console.log("Submitting", values))}
    >
      <MantineInput for={[form, "first"]} label="First Name" />
      <br />
      <br />
      <MantineInput for={[form, "last"]} label="Last Name" />
      <pre>{JSON.stringify(form.values, null, 2)}</pre>
      <button
        className="btn clear"
        type="button"
        onClick={() => form.setValues({ first: "", last: "" })}
      >
        Clear
      </button>

      <button>Submit</button>
    </form>
  );
}

const Field = createFormInput((props: TextFieldProps) => (
  <TextField {...props} helperText={props.error} />
));

function FormMuiDemo() {
  const form = useForm({
    schema: (z) =>
      z.object({
        first: z.string().min(8).max(5),
        last: z.string().min(8),
      }),
    initial: { first: "", last: "" },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => console.log("Submitting", values))}
    >
      <Field
        for={[form, "first"]}
        label="First Name"
        variant="filled"
        color="primary"
      />
      <br />
      <br />
      <Field
        for={[form, "last"]}
        label="Last Name"
        variant="filled"
        color="primary"
      />
      <pre>{JSON.stringify(form.values, null, 2)}</pre>
      <button
        className="btn clear"
        type="button"
        onClick={() => form.setValues({ first: "", last: "" })}
      >
        Clear
      </button>
      <button>Submit</button>
    </form>
  );
}
