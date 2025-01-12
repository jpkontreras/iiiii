import { HTMLAttributes } from 'react';

function Message({
  message,
  className = '',
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
  return message ? (
    <p
      {...props}
      className={
        'font-montserrat text-sm font-semibold tracking-tighter text-red-600 dark:text-red-400 ' +
        className
      }
    >
      {message}
    </p>
  ) : null;
}

Message.displayName = 'Message';

export { Message };
