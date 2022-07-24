import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Provider, useForm } from "./setup";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div>
        <Provider value="input">
          <FormDemo />
        </Provider>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
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
    {
      first: "",
      last: "",
    }
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
