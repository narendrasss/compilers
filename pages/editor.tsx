import React from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { HiChevronDown } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
import { parse } from "@babel/parser";

import { styled } from "@/stitches";
import { CodeBlock } from "../components/CodeBlock";
import { transform } from "../lib/useBabelPlugin";

const code = `
/**
 * A babel plugin to convert 'var' declarations to 'let'.
 */
export default () => {
  return {
    visitor: {
      VariableDeclaration(path) {
        if (path.node.kind === 'var') {
          // path.node.kind = 'let'
        }
      },
      Identifier(path) {

      }
    }
  }
}
`;

const input = `
var a = 10

function sum(a, b) {
  var result = a + b
  return result
}
`;

const tree = parse(input);

function getNodeAtPosition(model, position) {
  const text = model.getValueInRange({
    startColumn: 1,
    startLineNumber: 1,
    endColumn: position.column,
    endLineNumber: position.lineNumber,
  });

  const [, nodes] = text.split("visitor: {") as string[];
  if (nodes) {
    const matches = nodes.match(/([A-Z][a-z0-9]+)+/g);
    return matches?.reverse()[0];
  }
}

function getChildNodes(node) {
  return Object.values(node).filter((childProp: any) => {
    if (Array.isArray(childProp)) {
      const [first] = childProp;
      return first && Boolean(first.type);
    }
    return childProp && Boolean(childProp.type);
  });
}

function Tree({ tree, activeNode }) {
  if (Array.isArray(tree)) {
    return (
      <>
        {tree.map((node) => (
          <Tree tree={node} activeNode={activeNode} />
        ))}
      </>
    );
  }

  const childNodes = getChildNodes(tree);
  return (
    <div>
      <TypeLabel active={activeNode === tree.type}>
        <code>{tree.type}</code>
      </TypeLabel>
      <Wrapper>
        {childNodes.map((node) => (
          <Tree tree={node} activeNode={activeNode} />
        ))}
      </Wrapper>
    </div>
  );
}

const TypeLabel = styled("p", {
  width: "fit-content",

  variants: {
    active: {
      true: {
        background: "$mint8",
      },
    },
  },
});

const Wrapper = styled("div", {
  paddingLeft: "$4",
});

export default function Page() {
  const [output, setOutput] = React.useState("");
  const [activeNode, setActiveNode] = React.useState<string | undefined>();
  const editorRef = React.useRef<any>();
  const inputEditorRef = React.useRef<any>();

  function handleMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;
    editor.onKeyDown(({ code, metaKey }) => {
      if (metaKey && code === "Enter") {
        exec();
      }
    });
    editor.onDidChangeCursorPosition((args) => {
      const { position } = args;

      const model = editorRef.current.getModel();
      const node = getNodeAtPosition(model, position);

      setActiveNode(node);
    });
  }

  function exec() {
    setOutput("");
    console.log(editorRef.current);
    const code = editorRef.current.getValue();
    const input = inputEditorRef.current.getValue();
    const out = transform(input, code);
    setOutput(out);
  }

  return (
    <Main>
      <Column>
        <CodeEditor defaultValue={code} onMount={handleMount} />
      </Column>
      <Column>
        <Tree tree={tree.program} activeNode={activeNode} />
      </Column>
      <CodeOutput>
        <CodeEditor
          defaultValue={input}
          onMount={(editor) => (inputEditorRef.current = editor)}
        />
        <OutputCode>{output}</OutputCode>
        <Arrow>
          <HiChevronDown size="2rem" />
        </Arrow>
        <Play onClick={exec}>
          <FaPlay size="1rem" />
        </Play>
      </CodeOutput>
    </Main>
  );
}

function CodeEditor({ defaultValue, onMount }) {
  return (
    <Editor
      defaultLanguage="javascript"
      defaultValue={defaultValue}
      height="50vh"
      theme="myCustomTheme"
      beforeMount={prepareMonaco}
      onMount={onMount}
      options={{
        fontFamily: "Input Mono",
        fontSize: "13px",
        minimap: {
          enabled: false,
        },
        tabWidth: 2,
        scrollBeyondLastLine: false,
      }}
    />
  );
}

const OutputCode = styled(CodeBlock, {
  padding: "$16",
});

const Control = styled("div", {
  padding: "$2",
  borderRadius: "12px",
  border: "2px solid $mint4",
  width: "$8",
  aspectRatio: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "$mint2",
  color: "inherit",
});

const Arrow = styled(Control, {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});

const Play = styled(Control, {
  position: "absolute",
  border: "none",
  background: "$green8",
  top: "50%",
  transform: "translate(-50%, -50%)",
  cursor: "pointer",
});

const Main = styled("main", {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  height: "calc(100vh - 10px)",
});

const Title = styled("h1", {
  fontSize: "2.5rem",
  color: "$mint10",
  fontFamily: "$serif",
});

const Column = styled("div", {
  maxHeight: "100%",
  overflowY: "auto",

  "&:not(:last-child)": {
    borderRight: "2px solid $mint4",
  },
});

const CodeOutput = styled(Column, {
  display: "grid",
  gridTemplateRows: "repeat(2, 1fr)",
  position: "relative",

  "> :first-child": {
    borderBottom: "2px solid $mint4",
  },
});

const Article = styled(Column, {
  padding: "$16",
  lineHeight: 1.7,
  color: "$mint12",

  "> *": {
    gridColumn: 3,
  },

  "> :not(:last-child)": {
    marginBottom: "1em",
  },

  "> h2": {
    marginTop: "$16",
  },
});

function prepareMonaco(monaco: Monaco) {
  monaco.editor.defineTheme("myCustomTheme", {
    base: "vs-dark",
    inherit: false,
    rules: [
      {
        foreground: "e7fcf7",
        token: "",
      },
      {
        foreground: "006d5b",
        fontStyle: "italic",
        token: "comment",
      },
      {
        foreground: "30a46c",
        token: "keyword",
      },
      {
        token: "type.identifier",
        foreground: "4cc38a",
        fontStyle: "bold",
      },
      {
        token: "string",
        foreground: "4cc38a",
      },
    ],
    colors: {
      "editor.foreground": "#e7fcf7",
      "editor.background": "#05201e",
      "editor.selectionBackground": "#04312c",
      "editor.lineHighlightBackground": "#04312c",
      "editorCursor.foreground": "#7070FF",
      "editorWhitespace.foreground": "#BFBFBF",
      "editorIndentGuide.background": "#01453d",
    },
  });
}
