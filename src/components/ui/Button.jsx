import React from 'react';
import './Button.css';

function cx(...args) {
  return args.filter(Boolean).join(' ');
}

export default function Button({
  as = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}) {
  const Comp = as;
  return (
    <Comp className={cx('ui-button', `ui-button--${variant}`, `ui-button--${size}`, className)} {...rest}>
      {children}
    </Comp>
  );
}



