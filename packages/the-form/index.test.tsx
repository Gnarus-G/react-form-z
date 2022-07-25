import "@testing-library/jest-dom";
import { fireEvent, render } from "./test/utils";
import { describe, expect, it, vi } from "vitest";
import { useForm } from ".";

const FormDemo: React.FC<{ onSubmit: (values: object) => void }> = (props) => {
  const form = useForm(
    (z) =>
      z.object({
        first: z.string(),
        last: z.string(),
      }),
    { first: "", last: "" }
  );

  return (
    <form onSubmit={form.onSubmit(props.onSubmit)}>
      <input {...form.bind("first")} />
      <input {...form.bind("last")} />
      <button>Submit</button>
    </form>
  );
};

describe("happy path", () => {
  it("displays initial input (blank)", () => {
    const screen = render(<FormDemo onSubmit={vi.fn()} />);
    const [firstNameInput, lastNameInput] = screen.getAllByRole("textbox");

    expect(firstNameInput).toHaveDisplayValue("");
    expect(lastNameInput).toHaveDisplayValue("");
  });

  it("saves input in state, and gives it to the handler on submit", () => {
    const mockSubmitHandler = vi.fn();
    const screen = render(<FormDemo onSubmit={mockSubmitHandler} />);
    const [firstNameInput, lastNameInput] = screen.getAllByRole("textbox");

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
