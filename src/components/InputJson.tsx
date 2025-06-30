import React, { useEffect } from "react";
import Split from "@uiw/react-split";
import JsonViewer from "@uiw/react-json-view";
import CodeMirror from "@uiw/react-codemirror";
import { json as jsonLang } from "@codemirror/lang-json";

export default function InputJson({
  codeDefault = "{}",
  label = "Label",
  onChange,
  readonly,
}: {
  codeDefault?: string;
  label?: string;
  onChange: (value: any) => void;
  readonly?: boolean;
}) {
  const [code, setCode] = React.useState(codeDefault);
  const [json, setJson] = React.useState();
  const [message, setMessage] = React.useState("");
  const [linebar, setLinebar] = React.useState("");

  useEffect(() => {
    setCode(codeDefault);
    try {
      const obj = JSON.parse(codeDefault);
      setJson(obj);
      setMessage("");
    } catch {
      setJson(undefined);
      setMessage("JSON inválido");
    }
  }, [codeDefault]);

  const handleEditorChange = (value: string) => {
    setCode(value);
    setMessage("");
    try {
      if (value) {
        const obj = JSON.parse(value);
        setJson(obj);
        onChange(obj);
      } else {
        setJson(undefined);
        onChange(undefined);
      }
    } catch (error) {
      setJson(undefined);
      onChange(undefined);
      setMessage("JSON inválido");
    }
  };

  const formatJson = (replacer = 2) => {
    setMessage("");
    try {
      if (code) {
        const obj = JSON.parse(code);
        const str = JSON.stringify(obj, null, replacer);
        setCode(str);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
        setJson(undefined);
      } else {
        throw error;
      }
    }
  };

  const editor = (
    <div
      style={{
        width: "50%",
        position: "relative",
        backgroundColor: "rgb(245, 245, 245)",
      }}
    >
      <div
        style={{ overflow: "auto", height: "100%", boxSizing: "border-box" }}
      >
        <CodeMirror
          readOnly={readonly}
          value={code}
          height="100%"
          style={{ height: "100%" }}
          extensions={[jsonLang()]}
          onUpdate={(cm) => {
            const { selection } = cm.state;
            const line = cm.view.state.doc.lineAt(selection.main.from);
            setLinebar(
              `Linea ${line.number}/${cm.state.doc.lines}, Columna ${
                cm.state.selection.main.head - line.from + 1
              }`
            );
            const text = cm.state.sliceDoc(
              selection.main.from,
              selection.main.to
            );
            if (text) {
              if (selection.ranges.length > 1) {
                setLinebar(`${selection.ranges.length} selecciones la region`);
              } else {
                setLinebar(
                  `${text.split("\n").length} lineas, ${
                    text.length
                  } seleccione el caracter`
                );
              }
            }
          }}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
  const preview = (
    <div
      style={{
        flex: 1,
        minWidth: 230,
        userSelect: "none",
        padding: 10,
        overflow: "auto",
        backgroundColor: "rgb(255, 255, 255)",
      }}
    >
      {message && (
        <pre style={{ padding: 0, margin: 0, color: "red" }}>{message}</pre>
      )}
      {json && typeof json === "object" && (
        <JsonViewer value={json} style={{}} displayDataTypes={false} />
      )}
    </div>
  );
  return (
    <>
      <header className="flex justify-between items-center sticky top-0 z-10 bg-gray-100 px-4 pt-6 pb-4 rounded-[8px] rounded-b-none">
        <p className="text-lg font-medium">{label}</p>
        <menu className="flex gap-2">
          <div
            className="px-6 py-1 border-[#0066FF] border-[1px] text-[#0066FF] w-fit rounded-full cursor-pointer"
            onClick={() => formatJson()}
          >
            Formatear
          </div>
        </menu>
      </header>
      <Split
        mode="vertical"
        className=" bg-gray-100 px-4 py-6 rounded-[8px] overflow-y-auto h-full rounded-t-none"
      >
        <Split
          style={{
            flex: 1,
            height: "calc(100% - 32px)",
          }}
          className="overflow-y-scroll"
        >
          {editor}
          {preview}
        </Split>
        <div>
          <div className="grid gap-4 mt-4">
            <div className="text-[14px] font-medium ml-4">
              {linebar && <span>{linebar}</span>}
            </div>
            {message && <div className="text-[red]">{message}</div>}
          </div>
        </div>
      </Split>
    </>
  );
}
