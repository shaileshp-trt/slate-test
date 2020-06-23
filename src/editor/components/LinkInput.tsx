import React from 'react';
import { Input } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

export interface LinkProps {
  open: boolean;
  handleClose: () => void;
  saveLink: (value: string) => void;
}

const useStyles = makeStyles(theme => ({
  input: {
    color: theme.palette.common.white,
    padding: theme.spacing(0.25, 1),
  },
  inputField: {
    width: 'auto'
  },
  close: {
    opacity: 0.75,
    cursor: 'pointer',
    '&:hover': {
      opacity: 1,
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export function LinkInput(props: LinkProps) {
  const [link, setLink] = React.useState<string>('');
  const { handleClose, saveLink } = props;
  const s = useStyles();
  return (
    <form onSubmit={x => {
      saveLink(link);
      handleClose();
    }}
    >
      <Input
        classes={{ input: s.inputField }}
        className={s.input}
        type="url"
        value={link}
        onChange={x => setLink(x.target.value)}
        endAdornment={
          <Close
            className={s.close}
            fontSize="small"
            onClick={() => {
              setLink('');
              handleClose();
            }}
          />
        }
        placeholder="https://"
        disableUnderline
        autoFocus
      />
    </form>
  );
}

export default LinkInput;
