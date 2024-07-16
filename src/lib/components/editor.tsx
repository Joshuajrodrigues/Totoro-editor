import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";
import { useEffect, useRef } from "react";

import "../css/prosemirror.css";

export function Editor({ initialContent }: { initialContent?: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const mySchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    marks: schema.spec.marks,
  });
  useEffect(() => {
    if (editorRef.current) {
      let doc;
      if (initialContent) {
        const element = document.createElement("div");
        element.innerHTML = initialContent;
        doc = DOMParser.fromSchema(mySchema).parse(element);
      } else {
        doc = mySchema.topNodeType.createAndFill();
      }

      // Create the editor state with the initial document
      const state = EditorState.create({
        doc,
        schema: mySchema,
        plugins: exampleSetup({ schema: mySchema }),
      });

      // Create the editor view
      const view = new EditorView(editorRef.current, {
        state,
      });

      return () => {
        view.destroy();
      };
    }
  }, [initialContent, mySchema]);
  return (
    <>
      <div ref={editorRef} className="ProseMirror"></div>
    </>
  );
}
