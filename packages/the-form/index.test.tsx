import "@testing-library/jest-dom";
import { fireEvent, render } from "./test/utils";
import { describe, expect, it, vi } from "vitest";
import createFormHook from ".";

const useForm = createFormHook((props) => <input {...props} />);

const FormDemo: React.FC<{ onSubmit: (values: object) => void }> = (props) => {
  const form = useForm(
    (z) =>
      z.object({
        first: z.string(),
        last: z.string(),
      }),
    { first: "Jane", last: "Doe" }
  );

  return (
    <form onSubmit={form.onSubmit(props.onSubmit)}>
      <form.Input name="first" data-testid="first" />
      <form.Input name="last" data-testid="last" />
      <button>Submit</button>
    </form>
  );
};

describe("happy path", () => {
  it("displays initial input", () => {
    const screen = render(<FormDemo onSubmit={vi.fn()} />);
    const firstNameInput = screen.getByTestId("first");
    const lastNameInput = screen.getByTestId("last");

    expect(firstNameInput).toHaveDisplayValue("Jane");
    expect(lastNameInput).toHaveDisplayValue("Doe");
  });

  it("saves input in state, and gives it to the handler on submit", () => {
    const mockSubmitHandler = vi.fn();
    const screen = render(<FormDemo onSubmit={mockSubmitHandler} />);
    const firstNameInput = screen.getByTestId("first");
    const lastNameInput = screen.getByTestId("last");

    fireEvent.change(firstNameInput, {
      target: { value: "John" },
    });
    fireEvent.change(lastNameInput, {
      target: { value: "McAlister" },
    });

    screen.getByRole("button").click();

    expect(firstNameInput).toHaveDisplayValue("John");
    expect(lastNameInput).toHaveDisplayValue("McAlister");

    expect(mockSubmitHandler).toHaveBeenCalledWith({
      first: "John",
      last: "McAlister",
    });
  });
});
