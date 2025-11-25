import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { http } from "./httpLanguage"; // This import is correct

export default function CodeWrapper({
  language = "javascript",
  initialValue = "",
}) {
  const [value, setValue] = useState(initialValue);

  const getLanguage = () => {
    switch (language) {
      case "html":
        return [html()];
      case "css":
        return [css()];
      case "javascript":
      case "js":
        return [javascript({ jsx: true })];
      case "json":
        return [json()];
      case "http":
        return [http()]; // Only the language extension here

      default:
        return [javascript()];
    }
  };

  return (
    <CodeMirror
      value={value}
      height="100%"
      className="bg-gray h-full"
      theme="dark"
      extensions={[
        ...getLanguage(),
        EditorView.theme(
          {
            "&": { backgroundColor: "var(--color-gray)" },
            ".cm-content": { color: "var(--color-yellowish-white)" },
            ".cm-scroller": { backgroundColor: "var(--color-gray)" },
            ".cm-editor": { backgroundColor: "var(--color-gray)" },
            ".ͼp": { color: "#f8c555" },
            ".ͼu": { color: "#f08d49" },
            ".ͼt": { color: "#7ec699" },
            ".ͼ10": { color: "#67cdcc", textDecoration: "none" },
            ".ͼq": { color: "#cc99cd" },
            ".cm-gutters": {
              backgroundColor: "var(--color-gray)",
              borderRight: "none",
            },
            ".cm-gutter": { backgroundColor: "var(--color-gray)" },
            ".cm-activeLineGutter": { backgroundColor: "var(--color-gray)" },
            ".cm-foldGutter": { backgroundColor: "var(--color-gray)" },
            ".cm-lineNumbers .cm-gutterElement": {
              color: "rgba(255, 255, 240, 0.5)",
            },
          },
          { dark: true },
        ),
        // Custom highlight extension applied last
      ]}
      onChange={(val) => setValue(val)}
      basicSetup={{
        autocompletion: true,
        lineNumbers: true,
        highlightActiveLine: true,
        foldGutter: true,
        highlightSpecialChars: true,
        history: true,
        drawSelection: true,
      }}
    />
  );
}
