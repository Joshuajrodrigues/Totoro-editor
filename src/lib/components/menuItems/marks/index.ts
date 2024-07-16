import { schema as basicSchema } from 'prosemirror-schema-basic';
import { highlightMark } from './highlight';




export const myMarks = basicSchema.spec.marks.append({
    highlight: highlightMark
});
