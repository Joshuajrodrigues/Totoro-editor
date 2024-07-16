
import { toggleMark } from 'prosemirror-commands';
import { MenuItem } from 'prosemirror-menu';

const toggleHighlight = (color) => (state, dispatch) => {
    const { schema, tr, selection } = state;
    const markType = schema.marks.highlight;

    const isActive = state.selection.$from.marks().some(mark => mark.type === markType);

    if (isActive) {
        return toggleMark(markType)(state, dispatch);
    } else {
        return toggleMark(markType, { color })(state, dispatch);
    }
};
export const highlightMark = {
    attrs: { color: {} },
    parseDOM: [{
        tag: 'span[style]',
        getAttrs: node => {
            const match = /color:\s*([^;]+)/.exec(node.style.cssText);
            return match ? { color: match[1] } : false;
        }
    }],
    toDOM: mark => ["span", { style: `color: ${mark.attrs.color}` }, 0]
};

export const highlightMenuItem = new MenuItem({
    title: "Highlight",
    run: toggleHighlight("yellow"),
    icon: "",
    label: "highlight",
    content: 'Highlight'
});

