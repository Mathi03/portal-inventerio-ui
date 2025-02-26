import React, { useCallback, useEffect } from "react";
import Split from "@uiw/react-split";
import JsonViewer from "@uiw/react-json-view";
import CodeMirror from "@uiw/react-codemirror";
import { json as jsonLang } from "@codemirror/lang-json";

export default function InputJson({
  codeDefault = "{}",
  label = "Label",
  onChange,
}: {
  codeDefault?: string;
  label?: string;
  onChange: (value: any) => void;
}) {
  const [code, setCode] = React.useState(codeDefault);
  const [json, setJson] = React.useState();
  const [message, setMessage] = React.useState("");
  const [linebar, setLinebar] = React.useState("");
  const handleJson = useCallback(() => {
    setMessage("");
    try {
      if (code) {
        const obj = JSON.parse(code);
        setJson(obj);
        onChange(obj);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
        setJson(undefined);
        onChange(undefined);
      } else {
        throw error;
      }
    }
  }, [code, onChange]);

  const formatJson = useCallback(
    (_, replacer = 2) => {
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
    },
    [code],
  );
  useEffect(() => {
    handleJson();
  }, [code, handleJson]);
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
              }`,
            );
            const text = cm.state.sliceDoc(
              selection.main.from,
              selection.main.to,
            );
            if (text) {
              if (selection.ranges.length > 1) {
                setLinebar(`${selection.ranges.length} selecciones la region`);
              } else {
                setLinebar(
                  `${text.split("\n").length} lineas, ${
                    text.length
                  } seleccione el caracter`,
                );
              }
            }
          }}
          onChange={(value) => {
            setCode(value);
          }}
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
    <div className="min-h-[420px] bg-gray-100 px-4 py-6 rounded-[8px] overflow-auto">
      <Split mode="vertical">
        <header className="flex justify-between items-center mb-4">
          <p className="text-lg font-medium">{label}</p>
          <menu className="flex gap-2">
            <div
              className="px-6 py-1 border-[#0066FF] border-[1px] text-[#0066FF] w-fit rounded-full cursor-pointer"
              onClick={formatJson}
            >
              Formatear
            </div>
            {/* <div className="px-6 py-1 border-[#0066FF] border-[1px] text-[#0066FF] w-fit rounded-full" onClick={() => formatJson(null, 0)}>Acortar</div> */}
          </menu>
        </header>
        <Split
          style={{
            flex: 1,
            height: "calc(100% - 32px)",
          }}
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
    </div>
  );
}
