import { useForm } from "the-form";
import { createTheme, TextField, ThemeProvider } from "@mui/material";
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

function FormDemo() {
  const form = useForm(
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
      <input {...form.bind("first")} />
      <br />
      <br />
      <input {...form.bind("last")} />
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

function FormMantineDemo() {
  const form = useForm(
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
      <TextInput {...form.bind("first")} label="First Name" />
      <br />
      <br />
      <TextInput {...form.bind("last")} label="Last Name" />
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

function FormMuiDemo() {
  const form = useForm(
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
      <TextField
        {...form.bind("first")}
        label="First Name"
        variant="filled"
        color="primary"
      />
      <br />
      <br />
      <TextField
        {...form.bind("last")}
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
