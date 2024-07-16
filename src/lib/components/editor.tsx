import { exampleSetup } from 'prosemirror-example-setup';
import { MenuItem, menuBar } from 'prosemirror-menu';
import { DOMParser, Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { useEffect, useRef } from 'react';

import '../css/prosemirror.css';
import { myMarks } from './menuItems/marks';
import { menuItems } from './menuItems';

const customNode = {
  content: "inline*",
  inline: true,
  group: "inline",
  parseDOM: [{ tag: "custom-node" }],
  toDOM: () => ["custom-node", 0]
};

const myNodes = basicSchema.spec.nodes.append({
  custom_node: customNode
});


const mySchema = new Schema({
  nodes: addListNodes(myNodes, "paragraph block*", "block"),
  marks: myMarks
});



const insertCustomNode = (state, dispatch) => {
  const { schema, tr, selection } = state;
  const { from, to } = selection;
  const nodeType = schema.nodes.custom_node;

  if (!nodeType) return false;

  const node = nodeType.create();
  tr.replaceRangeWith(from, to, node);
  tr.setSelection(TextSelection.create(tr.doc, from + 1));
  dispatch(tr.scrollIntoView());
  return true;
};


const customNodeMenuItem = new MenuItem({
  title: "Custom Node",
  run: insertCustomNode,
  content: 'Custom Node',
  icon: "",
  label: "node",
});


const Editor = ({ initialContent }: { initialContent?: string }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      let doc;
      if (initialContent) {
        const element = document.createElement('div');
        element.innerHTML = initialContent;
        doc = DOMParser.fromSchema(mySchema).parse(element);
      } else {
        doc = mySchema.topNodeType.createAndFill();
      }

      const state = EditorState.create({
        doc,
        schema: mySchema,
        plugins: [
          ...exampleSetup({ schema: mySchema }),
          menuBar({
            floating: true,
            content: [menuItems]
          })
        ],
      });

      const view = new EditorView(editorRef.current, {
        state,
      });

      return () => {
        view.destroy();
      };
    }
  }, [initialContent, mySchema]);

  return <div ref={editorRef} className="ProseMirror"></div>;
};

export default Editor;
