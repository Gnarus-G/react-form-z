import createFormHook from "the-form";
import "./App.css";

const useForm = createFormHook((props) => <input {...props} />);

function App() {
  return (
    <div className="App">
      <FormDemo />
    </div>
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
