import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";

type CodeBlockProps = {
  language?: string;
  children: React.ReactNode;
};

export function CodeBlock({
  language = "javascript",
  children,
}: CodeBlockProps) {
  return (
    <SyntaxHighlighter language={language} style={style}>
      {children}
    </SyntaxHighlighter>
  );
}

const style = {
  "hljs-comment": {
    color: "#006d5b",
  },
  "hljs-string": {
    color: "#4cc38a",
  },
  "hljs-keyword": {
    color: "#30a46c",
  },
  hljs: {
    display: "block",
    overflowX: "auto",
    background: "#05201e",
    color: "#e7fcf7",
    fontSize: "13px",
    lineHeight: 1.4,
  },
  "hljs-emphasis": {
    fontStyle: "italic",
  },
  "hljs-strong": {
    fontWeight: "bold",
  },
};