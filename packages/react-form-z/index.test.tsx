import { render, act, cleanup } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createFormInput, useForm } from ".";

afterEach(() => {
  cleanup();
});

const Input = createFormInput((props) => (
  <>
    <input {...props} />
    <p>{props.error}</p>
  </>
));

describe("happy path", () => {
  it("displays initial input (blank)", () => {
    const { result } = renderHook(() =>
      useForm({
        schema: (z) =>
          z.object({
            first: z.string(),
            last: z.string(),
          }),
        initial: { first: "Jane", last: "Doe" },
      })
    );

    const form = result.current;

    const screen = render(
      <>
        <Input for={[form, "first"]} />
        <Input for={[form, "last"]} />
      </>
    );
    const [firstNameInput, lastNameInput] = screen.getAllByRole("textbox");

    expect(firstNameInput).toHaveDisplayValue("Jane");
    expect(lastNameInput).toHaveDisplayValue("Doe");
  });

  it("saves input in state, and gives it to the handler on submit", async () => {
    const { result } = renderHook(() =>
      useForm({
        schema: (z) =>
          z.object({
            first: z.string(),
            last: z.string(),
          }),
        initial: { first: "", last: "" },
      })
    );

    const mockSubmitHandler = vi.fn();
    act(() => {
      result.current.setData({
        first: "John",
        last: "McAlister",
      });
    });

    expect(result.current.data).toEqual({
      first: "John",
      last: "McAlister",
    });

    const submit = result.current.onSubmit(async (v) => mockSubmitHandler(v));
    await submit();

    expect(mockSubmitHandler).toBeCalledWith({
      first: "John",
      last: "McAlister",
    });
  });

  it("allows updating state", () => {
    const { result } = renderHook(() =>
      useForm({
        schema: (z) =>
          z.object({
            first: z.string(),
            last: z.string(),
          }),
        initial: { first: "Bill", last: "Bob" },
      })
    );

    act(() => {
      result.current.setData({
        first: "",
        last: "",
      });
    });

    expect(result.current.data).toEqual({
      first: "",
      last: "",
    });
  });

  it("validates on submit and sets errors", async () => {
    const mockSubmitHandler = vi.fn();
    const { result } = renderHook(() =>
      useForm({
        schema: (z) =>
          z.object({
            first: z.string().min(8),
            last: z.string().min(8),
          }),
        initial: { first: "", last: "" },
      })
    );

    const submit = result.current.onSubmit(async (v) => mockSubmitHandler(v));
    await submit();

    expect(mockSubmitHandler).not.toBeCalled();

    expect(result.current.errors.first).toBeDefined();
    expect(result.current.errors.last).toBeDefined();
  });
});
