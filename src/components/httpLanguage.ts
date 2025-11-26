import { StreamLanguage, type StreamParser } from "@codemirror/language";

// ============================
// 1. Define the Stream Parser
// ============================

const httpMode: StreamParser<{ inBody: boolean }> = {
  startState() {
    return { inBody: false };
  },

  token(stream, state) {
    if (stream.match(/"([^"]+)"\s*:/)) return "keyword"; // ͼp
    if (stream.match(/"((?:\\.|[^"\\])*)"(?=,|})/)) {
      return "def"; // ͼt
    }
    if (stream.match(/\s*(?:"([^"]*)")(?=\s|$)/)) return "def"; // ͼt

    if (stream.match(/\s+\d+(?:\.\d+)?\b/)) return "number"; // ͼu
    if (stream.match(/\s+(true|false)\b/)) return "number"; // ͼu

    // ----- Request line -----
    if (stream.sol()) {
      if (stream.match(/(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/)) {
        return "keyword"; // ͼp
      }

      if (stream.match(/^\s*$/)) {
        state.inBody = true;
        stream.skipToEnd();
        return null;
      }
    }

    if (stream.match(/HTTP\/\d\.\d/)) {
      return "keyword"; // ͼp
    }

    // URL
    if (stream.match(/\s\/\S*\s/)) return "link"; // ͼ10

    // Header keys
    if (stream.match(/^[A-Za-z0-9-]+(?=:\s)/)) return "propertyName"; // ͼq

    stream.next();
    return null;
  },
};

export const http = () => StreamLanguage.define(httpMode);

// ============================
// 2. Syntax Highlighting Theme
// ============================

// Use .define(), then wrap it safely in syntaxHighlighting()
// This works in ALL CodeMirror versions.
// const httpStyle = HighlightStyle.define([
//   { tag: t.keyword, class: "cm-keyword" },
//   { tag: t.atom, className: "cm-atom" },
//   { tag: t.link, className: "cm-link" },
//   { tag: t.propertyName, className: "cm-property" },
//   { tag: t.string, className: "cm-string" },
//   { tag: t.number, className: "cm-number" },
// ]);

// export const httpHighlight = syntaxHighlighting(httpStyle);
