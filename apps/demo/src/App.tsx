import createFormHook from "the-form";
import { createTheme, TextField, ThemeProvider } from "@mui/material";
import { MantineProvider, TextInput } from "@mantine/core";
import "./App.css";

const useForm = createFormHook((props) => <input {...props} />);

function App() {
  return (
    <>
      <div className="App">
        <FormDemo />
      </div>
      <br />
      <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
        <FormMuiDemo />
      </ThemeProvider>
      <br />
      <MantineProvider theme={{ colorScheme: "dark" }}>
        <FormMantineDemo />
      </MantineProvider>
    </>
  );
}

export default App;

function FormDemo() {
  const [form, Input] = useForm(
    (z) =>
      z.object({
        first: z.string(),
        last: z.string(),
      }),
    { first: "", last: "" }
  );

  return (
    <form
      onSubmit={form.onSubmit((values) => console.log("Submitting", values))}
    >
      <Input name="first" />
      <br />
      <br />
      <Input name="last" />
      <pre>{JSON.stringify(form.values, null, 2)}</pre>
      <button>Submit</button>
    </form>
  );
}

const useFormMantine = createFormHook(TextInput);

function FormMantineDemo() {
  const [form, Input] = useFormMantine(
    (z) =>
      z.object({
        first: z.string(),
        last: z.string(),
      }),
    { first: "", last: "" }
  );

  return (
    <form
      onSubmit={form.onSubmit((values) => console.log("Submitting", values))}
    >
      <Input label="First Name" name="first" />
      <br />
      <br />
      <Input label="Last Name" name="last" />
      <pre>{JSON.stringify(form.values, null, 2)}</pre>
      <button>Submit</button>
    </form>
  );
}

const useFormMui = createFormHook(TextField);

function FormMuiDemo() {
  const [form, Input] = useFormMui(
    (z) =>
      z.object({
        first: z.string(),
        last: z.string(),
      }),
    { first: "", last: "" }
  );

  return (
    <form
      onSubmit={form.onSubmit((values) => console.log("Submitting", values))}
    >
      <Input label="First Name" name="first" variant="filled" color="primary" />
      <br />
      <br />
      <Input label="Last Name" name="last" variant="filled" color="primary" />
      <pre>{JSON.stringify(form.values, null, 2)}</pre>
      <button>Submit</button>
    </form>
  );
}
