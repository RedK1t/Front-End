import { StreamLanguage, type StreamParser } from "@codemirror/language";

// ============================
// 1. Define the Stream Parser
// ============================
export const http = (query = "") => {
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const queryRegex = query ? new RegExp(escapeRegExp(query), "i") : null;

  const httpMode: StreamParser<{ inBody: boolean; isHtml: boolean }> = {
    startState() {
      return { inBody: false, isHtml: false };
    },
    token(stream, state) {
      if (state.isHtml) {
        stream.skipToEnd();
        return null;
      }

      if (stream.match(/<!DOCTYPE html>/i)) {
        state.isHtml = true;
        stream.skipToEnd();
        return "meta";
      }

      if (queryRegex) {
        const remainingLine = stream.string.substring(stream.pos);
        const match = remainingLine.match(queryRegex);

        if (match) {
          const matchStartRelative = remainingLine.indexOf(match[0]);

          if (matchStartRelative > 0) {
            // If the query is found later in the current segment,
            // consume the characters *before* the query as unstyled.
            // This means any text before the query on the same line will not be syntax highlighted
            // by other rules in this token call.
            stream.pos += matchStartRelative;
            return null; // Return null for unstyled text
          } else {
            // The query is at the current position. Consume it and highlight.
            stream.pos += match[0].length;
            return "atom"; // ͼ12
          }
        }
      }
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

  return StreamLanguage.define(httpMode);
};

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
