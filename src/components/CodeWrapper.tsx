import { useEffect, useState } from "react";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { http } from "./httpLanguage"; // This import is correct
import { useSearchParams } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

export default function CodeWrapper({
  language = "javascript",
  initialValue = "",
  editableProp = true,
  type = "Request",
  onBlur,
  onChange: onChangeProp,
  editorRef,
}: {
  language?: "html" | "css" | "javascript" | "js" | "json" | "http";
  initialValue?: string;
  editableProp?: boolean;
  type?: "Request" | "Response" | "Request Template";
  onBlur?: (value: string) => void;
  onChange?: (value: string) => void;
  editorRef?: React.RefObject<ReactCodeMirrorRef | null>;
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const [searchParams] = useSearchParams();
  const query = searchParams.get(`${type}query`) || undefined;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Syntax-token colors per theme. The dark palette is tuned for a dark background;
  // on a light background those same colors wash out, so light mode uses darker,
  // higher-contrast variants. (.ͼ12 is the search-match highlight — readable on both.)
  const tokens = isDark
    ? {
        content: "var(--color-yellowish-white)",
        p: "#f8c555",
        u: "#f08d49",
        t: "#7ec699",
        ten: "#67cdcc",
        q: "#cc99cd",
        gutter: "rgba(255, 255, 240, 0.5)",
      }
    : {
        content: "#1f2937",
        p: "#b45309",
        u: "#c2410c",
        t: "#15803d",
        ten: "#0e7490",
        q: "#7e22ce",
        gutter: "rgba(31, 41, 55, 0.5)",
      };

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
        return [http(query)]; // Only the language extension here

      default:
        return [javascript()];
    }
  };

  return (
    <CodeMirror
      ref={editorRef}
      value={value}
      height="100%"
      className="bg-gray text-rem-[0.875] h-full"
      theme={isDark ? "dark" : "light"}
      extensions={[
        ...getLanguage(),
        EditorView.theme(
          {
            "&": { backgroundColor: "var(--color-gray)" },
            ".cm-content": { color: tokens.content },
            ".cm-scroller": { backgroundColor: "var(--color-gray)" },
            ".cm-editor": { backgroundColor: "var(--color-gray)" },
            ".ͼp": { color: tokens.p },
            ".ͼ12": { backgroundColor: "#f8c555", color: "#000" },
            ".ͼu": { color: tokens.u },
            ".ͼt": { color: tokens.t },
            ".ͼ10": { color: tokens.ten, textDecoration: "none" },
            ".ͼq": { color: tokens.q },
            ".cm-gutters": {
              backgroundColor: "var(--color-gray)",
              borderRight: "none",
            },
            ".cm-gutter": { backgroundColor: "var(--color-gray)" },
            ".cm-activeLineGutter": { backgroundColor: "var(--color-gray)" },
            ".cm-foldGutter": { backgroundColor: "var(--color-gray)" },
            ".cm-lineNumbers .cm-gutterElement": {
              color: tokens.gutter,
            },
          },
          { dark: isDark },
        ),
        // Custom highlight extension applied last
      ]}
      editable={editableProp}
      onChange={(val) => {
        setValue(val);
        if (onChangeProp) {
          onChangeProp(val);
        }
      }}
      onBlur={() => onBlur?.(value)}
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
