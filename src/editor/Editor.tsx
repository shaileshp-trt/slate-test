import React from 'react';
import { createEditor, Node, } from 'slate';
import {
  Editable,
  withReact,
  Slate,
} from 'slate-react';
import { Toolbar } from './Toolbar';
import { renderLeaf, renderElement, withLinks } from '../utils';

export interface EditorProps {
  value: Node[];
  onChange: (value: Node[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
}

export function Editor(props: EditorProps) {
  const { value, onChange, ...other } = props;
  const editor = React.useMemo(() => withLinks(withReact(createEditor())), []);

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Toolbar open={true} anchorEl={null} />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        {...other}
      />
    </Slate>
  );
}

export { Node };
