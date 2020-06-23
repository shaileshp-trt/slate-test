import React, { ReactNode } from 'react';
import { cx, css } from 'emotion';

export interface MenuProps {
  className: string;
  children: ReactNode;
}

const Menu = React.forwardRef(
  (props: MenuProps, ref?: React.Ref<HTMLDivElement>) => {
    const { className, children } = props;
    return (
      <div
        ref={ref}
        className={cx(
          className,
          css`
          & > * {
            display: flex;
          }
          & > * + * {
            margin-left: 15px;
          }
        `
        )}
      >
        {children}
      </div>
    );
  },
);

export default Menu;
