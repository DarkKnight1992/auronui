import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Form } from "../Form";
import { FormField } from "../FormField";
import { FormFieldArray } from "../FormFieldArray";

// NOTE: There is no AuronUI Input component ported yet in this batch, so
// these tests render a bare <input> as the FormField's field renderer.
// FormField hands back a plain {value, onChange, onBlur, ...} contract —
// any controlled field element can consume it.

describe("Form + FormField — submit validation", () => {
  it("submits with values when the required field is filled", async () => {
    const onSubmit = vi.fn();
    render(
      <Form onSubmit={onSubmit}>
        <FormField name="email" rules={{ required: true }}>
          {({ fieldProps }) => (
            <input
              aria-label="Email"
              value={(fieldProps.value as string) ?? ""}
              onChange={(e) => fieldProps.onChange(e.target.value)}
              onBlur={fieldProps.onBlur}
            />
          )}
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    await userEvent.type(screen.getByLabelText("Email"), "hi@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0]![0].values).toEqual({ email: "hi@example.com" });
  });

  it("blocks submit and surfaces an error when a required field is empty", async () => {
    const onSubmit = vi.fn();
    const onInvalid = vi.fn();
    render(
      <Form onSubmit={onSubmit} onInvalid={onInvalid}>
        <FormField name="email" rules={{ required: true }}>
          {({ fieldProps, error }) => (
            <>
              <input
                aria-label="Email"
                value={(fieldProps.value as string) ?? ""}
                onChange={(e) => fieldProps.onChange(e.target.value)}
                onBlur={fieldProps.onBlur}
              />
              {error && <span data-testid="error">{error}</span>}
            </>
          )}
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(onInvalid).toHaveBeenCalledTimes(1));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId("error").textContent).toBe("Enter a value");
  });

  it("matches rule fails when confirm field doesn't match", async () => {
    const onSubmit = vi.fn();
    const onInvalid = vi.fn();
    render(
      <Form onSubmit={onSubmit} onInvalid={onInvalid}>
        <FormField name="password" defaultValue="abc123">
          {({ fieldProps }) => (
            <input
              aria-label="Password"
              value={(fieldProps.value as string) ?? ""}
              onChange={(e) => fieldProps.onChange(e.target.value)}
            />
          )}
        </FormField>
        <FormField name="confirm" defaultValue="wrong" rules={{ matches: "password" }}>
          {({ fieldProps, error }) => (
            <>
              <input
                aria-label="Confirm"
                value={(fieldProps.value as string) ?? ""}
                onChange={(e) => fieldProps.onChange(e.target.value)}
              />
              {error && <span data-testid="confirm-error">{error}</span>}
            </>
          )}
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onInvalid).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("confirm-error").textContent).toBe("Must match password");
  });
});

describe("FormFieldArray", () => {
  function ContactsForm({ onSubmit }: { onSubmit: (payload: unknown) => void }) {
    return (
      <Form onSubmit={onSubmit} defaultValues={{ contacts: [{ name: "Jane" }] }}>
        <FormFieldArray name="contacts">
          {({ fields, fieldName, append, remove }) => (
            <div>
              {fields.map((row) => (
                <div key={row.id} data-testid={`row-${row.id}`}>
                  <FormField name={fieldName(row.index, "name")}>
                    {({ fieldProps }) => (
                      <input
                        aria-label={`Name ${row.index}`}
                        value={(fieldProps.value as string) ?? ""}
                        onChange={(e) => fieldProps.onChange(e.target.value)}
                      />
                    )}
                  </FormField>
                  <button type="button" onClick={() => remove(row.index)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => append({ name: "" })}>
                Add
              </button>
            </div>
          )}
        </FormFieldArray>
        <button type="submit">Submit</button>
      </Form>
    );
  }

  it("append adds a new row, submit produces a nested array shape", async () => {
    const onSubmit = vi.fn();
    render(<ContactsForm onSubmit={onSubmit} />);

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getAllByRole("textbox")).toHaveLength(2);

    await userEvent.type(screen.getByLabelText("Name 1"), "Bob");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect((onSubmit.mock.calls[0]![0] as { values: unknown }).values).toEqual({
      contacts: [{ name: "Jane" }, { name: "Bob" }],
    });
  });

  it("remove drops the targeted row", async () => {
    const onSubmit = vi.fn();
    render(<ContactsForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getAllByRole("textbox")).toHaveLength(2);

    await userEvent.click(screen.getAllByRole("button", { name: "Remove" })[0]!);
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });
});

describe("Form — accessibility", () => {
  it("has no accessibility violations with a field in error state", async () => {
    const { container } = render(
      <Form>
        <FormField name="email" rules={{ required: true }}>
          {({ fieldProps, isInvalid, error }) => (
            <div>
              <label htmlFor="email-input">Email</label>
              <input
                id="email-input"
                aria-invalid={isInvalid || undefined}
                aria-describedby={error ? "email-error" : undefined}
                value={(fieldProps.value as string) ?? ""}
                onChange={(e) => fieldProps.onChange(e.target.value)}
              />
              {error && (
                <span id="email-error" role="alert">
                  {error}
                </span>
              )}
            </div>
          )}
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());

    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
