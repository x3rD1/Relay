import { useDialogVisible } from "../hooks/useDialogVisible";
import { useUpdateResponse } from "../hooks/useUpdateResponse";
import ResponseDialog from "./ResponseDialog";

export default function Overlay() {
  const { dialogVisible, toggleDialog } = useDialogVisible();
  const response = useUpdateResponse();

  if (dialogVisible === null) {
    return null;
  }

  return (
    <>
      <div
        style={{
          display: dialogVisible ? "block" : "none",
          position: "fixed",
          backgroundColor: "#333",
          width: "100%",
          maxWidth: "40%",
          minHeight: "250px",
          color: "white",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <button
          onClick={toggleDialog}
          style={{ position: "absolute", right: "0" }}
        >
          _
        </button>

        {response && <ResponseDialog response={response} />}
      </div>

      <button
        onClick={toggleDialog}
        style={{
          display: !dialogVisible ? "block" : "none",
          position: "fixed",
          padding: "0px 32px",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        ︿
      </button>
    </>
  );
}
