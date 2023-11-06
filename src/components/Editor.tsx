import MonacoEditor from "react-monaco-editor"
import * as monacoEditor from "monaco-editor"

export const Editor = ({ agent }) => {
  return (
    <MonacoEditor
      // className="flex-auto "
      value={agent.promptTemplate}
      language="plaintext"
      options={{
        lineNumbers: "off",
        // minimap: { enabled: false },
        scrollBeyondLastLine: false,
        quickSuggestions: {
          other: "inline",
          comments: true,
          strings: true,
        },
      }}
      onChange={(value) => {
        agent.update({ promptTemplate: value })
        debounced()
      }}
      editorDidMount={(
        editor: monacoEditor.editor.IStandaloneCodeEditor,
        monaco: typeof monacoEditor,
      ) => {
        monaco.languages.registerCompletionItemProvider("plaintext", {
          async provideInlineCompletionItems() {},
        })
      }}
    />
  )
}
