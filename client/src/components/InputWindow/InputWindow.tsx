import { LegacyRef } from "react";

type InputWindowProps = {
  handleSubmit: (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void;
  inputRef: LegacyRef<HTMLInputElement>;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputWindow = ({
  handleSubmit,
  inputRef,
  value,
  onChange,
}: InputWindowProps): JSX.Element => {
  return (
    <div className="input-window">
      <form onSubmit={handleSubmit} style={{ padding: "0 1rem" }}>
        <div className="input-container">
          <label
            htmlFor="message"
            style={{
              textAlign: "center",
              overflow: "hidden",
              width: "1px",
              position: "absolute",
            }}
          >
            Write your message
          </label>
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            className="input"
            type="text-area"
            placeholder="Write your message"
            name="message"
            id="message"
            // disabled={disabled}
          />
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 0.5 }}>
            <ul style={{ fontSize: "10px" }}>
              <li>
                <code>/nick {"<value>"}</code>
                <small style={{ marginLeft: "1rem" }}>
                  Gives you a username!
                </small>
              </li>

              <li>
                <code>/think {"<value>"}</code>
                <small style={{ marginLeft: "1rem" }}>
                  Gives a dark gray color to your message!
                </small>
              </li>
              <li>
                <code>/oops</code>
                <small style={{ marginLeft: "1rem" }}>
                  Removes your last message sent!
                </small>
              </li>
            </ul>
          </div>
          <button style={{ flex: 0.5 }} type="submit">
            Send message
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputWindow;
