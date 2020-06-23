import React from 'react';
import { useSlate } from 'slate-react';
import { Editor, Transforms } from 'slate';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import { LIST_TYPES, STYLES } from "./../constant"

/**
 *
 * @param editor
 * @param format
 * @description Check if selected Block is active or not
 */

const isBlockActive = (editor: any, format: any) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  });
  return !!match;
};

/**
 *
 * @param editor
 * @param format
 * @description Toggle the style on selected textt
 */

const toggleBlock = (editor: any, format: any) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n: any) => LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? STYLES.paragraph : isList ? STYLES.listItem : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.common.black,
  },
  button: {
    color: theme.palette.common.white,
    opacity: 0.75,
    '&:hover': {
      opacity: 1,
    },
    paddingTop: 8,
    paddingBottom: 8,
  }
}));

const isMarkActive = (editor: any, format: string) => {
  const [link] = Editor.nodes(editor, { match: n => n.type === format });
  return link ? { color: '#34e79a' } : {};
};

export interface BlockProps {
  icon: string;
  format: string;
  size?: any;
}

export function BlockButton(props: BlockProps) {
  const { format, icon, size } = props;
  const editor = useSlate();
  const s = useStyles();
  return (
    <IconButton
      className={s.button}
      size="small"
      onMouseDown={event => {
        toggleBlock(editor, format);
      }}
    >
      <Icon fontSize={size} style={isMarkActive(editor, format)}>{icon}</Icon>
    </IconButton>
  );
}

export default BlockButton;

