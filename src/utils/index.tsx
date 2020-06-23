import React from 'react';
import { Transforms, Text, Editor, Range } from 'slate';
import { RenderLeafProps, RenderElementProps } from 'slate-react';
import isUrl from 'is-url';
import { ELEMENTS } from "../editor/constant"

/**
 *
 * @param editor
 * @param format
 */
const toggleFormat = (editor: any, format: any) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  );
};

const isFormatActive = (editor: any, format: any) => {
  const [match] = Editor.nodes(editor, {
    match: (n: any) => n[format] === true,
    mode: 'all',
  });
  return !!match;
};

const setActiveColor = (editor: any, format: any) => isFormatActive(editor, format) ? { color: '#34e79a' } : {};

const renderLeaf = (props: RenderLeafProps) => {
  let { attributes, children, leaf } = props;
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u>{children}</u>;
  }

  if (leaf.type && leaf.type === ELEMENTS.link) {
    children = <a href={`${leaf.url}`} style={{ color: 'blue' }}>{children}</a>;
  }
  if (leaf.code) {
    children = <code><span>{children}</span></code>;
  }
  return <span {...attributes}>{children}</span>;
};


// For the Render Element Utils Functions start here

const renderElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case ELEMENTS.blockQuote:
      return <blockquote {...attributes}><span>{children}</span></blockquote>;
    case ELEMENTS.bulletedList:
      return <ul {...attributes}>{children}</ul>;
    case ELEMENTS.headingOne:
      return <h1 {...attributes}>{children}</h1>;
    case ELEMENTS.headingTwo:
      return <h2 {...attributes}>{children}</h2>;
    case ELEMENTS.listItem:
      return <li {...attributes}>{children}</li>;
    case ELEMENTS.numberedList:
      return <ol {...attributes}>{children}</ol>;
    case ELEMENTS.link:
      return (
        <a {...attributes} href={`${element.url}`}>
          {children}
        </a>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const isLinkActive = (editor: any) => {
  const [link] = Editor.nodes(editor, { match: n => n.type === ELEMENTS.link });
  return !!link;
};

const unwrapLink = (editor: any) => {
  Transforms.unwrapNodes(editor, { match: n => n.type === ELEMENTS.link });
};

const wrapLink = (editor: any, url: any) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: ELEMENTS.link,
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

const withLinks = (editor: any) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element: any) => {
    return element.type === ELEMENTS.link ? true : isInline(element);
  };
  editor.insertText = (text: string) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };
  editor.insertData = (data: any) => {
    const text = data.getData('text/plain');
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };
  return editor;
};

const insertLink = (editor: any, url: any) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

const setActiveColorForLink = (editor: any) => isLinkActive(editor) ? { opacity: 1 } : {};

export {
  insertLink,
  isFormatActive,
  renderLeaf,
  renderElement,
  setActiveColor,
  toggleFormat,
  withLinks,
  wrapLink,
  unwrapLink,
  setActiveColorForLink,
  isLinkActive,
};
