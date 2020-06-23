import React, { useRef, useEffect } from 'react';
import {
  PopperProps,
  ButtonGroup,
  IconButton,
} from '@material-ui/core';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  CodeOutlined,
  Link
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useSlate, ReactEditor } from 'slate-react';
import { Range, Editor } from 'slate';
import { Menu, LinkInput, BlockButton } from './components';
import {
  toggleFormat,
  insertLink,
  setActiveColor,
  unwrapLink,
  setActiveColorForLink,
  isLinkActive
} from '../utils';
import { STYLES } from "./constant"
import './style.css';

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

export interface ToolbarProps extends Omit<PopperProps, 'children'> { }

const onMouseDown = (event: any, editor: any, type: string) => {
  event.preventDefault();
  toggleFormat(editor, type);
};

export function Toolbar(props: ToolbarProps) {
  const [link, setLink] = React.useState<boolean>(false);
  const s = useStyles();
  const editor = useSlate();
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
  const editorSelection = React.useRef(editor.selection);

  // Using this logic showing the toolbar when select the text
  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;
    if (!el) {
      return;
    }
    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      // @ts-ignore
      if (link) {
        return;
      }
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection && domSelection.getRangeAt(0);
    // @ts-ignore
    const rect = domRange.getBoundingClientRect();
    // @ts-ignore
    el.style.opacity = 1;
    // @ts-ignore
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    // @ts-ignore
    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
  });

  // Managing the prev selection for LinkInput
  useEffect(() => {
    if (link) {
      editorSelection.current = editor.selection;
    }
  }, [link]);

  return (
    <Menu
      ref={ref}
      className="toolbar"
    >
      {!link ? <ButtonGroup variant="text" color="primary">
        <IconButton
          className={s.button}
          size="small"
          onMouseDown={event => {
            onMouseDown(event, editor, STYLES.bold);
          }}
        >
          <FormatBold fontSize="small" style={setActiveColor(editor, STYLES.bold)} />
        </IconButton>
        <IconButton
          className={s.button}
          size="small"
          onMouseDown={event => {
            onMouseDown(event, editor, STYLES.italic);
          }}
        >
          <FormatItalic fontSize="small" style={setActiveColor(editor, STYLES.italic)} />
        </IconButton>
        <IconButton
          className={s.button}
          size="small"
          onMouseDown={event => {
            onMouseDown(event, editor, STYLES.underlined);
          }}
        >
          <FormatUnderlined fontSize="small" style={setActiveColor(editor, STYLES.underlined)} />
        </IconButton>
        <IconButton
          className={s.button}
          size="small"
          onMouseDown={event => {
            onMouseDown(event, editor, STYLES.code);
          }}
        >
          <CodeOutlined fontSize="small" style={setActiveColor(editor, STYLES.code)} />
        </IconButton>
        <IconButton
          className={s.button}
          size="small"
          onClick={() => {
            if (isLinkActive(editor))
              unwrapLink(editor);
            else
              setLink(true);
          }}
          style={setActiveColorForLink(editor)}
        >
          <Link fontSize="small" />
        </IconButton>
        <BlockButton format="heading-one" icon={STYLES.title} size="large" />
        <BlockButton format="heading-two" icon={STYLES.title} size="small" />
        <BlockButton format="block-quote" icon={STYLES.formatQuote} size="small" />
        <BlockButton format="numbered-list" icon={STYLES.formatNumber} size="small" />
        <BlockButton format="bulleted-list" icon={STYLES.formatBulleted} size="small" />
      </ButtonGroup> :
        <LinkInput
          open={link}
          handleClose={() => setLink(false)}
          saveLink={(value: string) => {
            editor.selection = editorSelection.current;
            insertLink(editor, value);
          }}
        />}
    </Menu>
  );
}
