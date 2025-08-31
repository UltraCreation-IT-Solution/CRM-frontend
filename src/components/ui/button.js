import { forwardRef } from 'react';
import { clsx } from 'clsx';

// Button variants and sizes
const buttonVariants = {
  variant: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  size: {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  },
};

const Button = forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  loading = false,
  disabled = false,
  children,
  ...props
}, ref) => {
  const Comp = asChild ? 'span' : 'button';

  const buttonClasses = clsx(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    buttonVariants.variant[variant],
    buttonVariants.size[size],
    loading && 'cursor-not-allowed opacity-50',
    className
  );

  return (
    <Comp
      className={buttonClasses}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner className="mr-2 h-4 w-4" />
      )}
      {children}
    </Comp>
  );
});

Button.displayName = 'Button';

// Loading spinner component
function LoadingSpinner({ className }) {
  return (
    <svg
      className={clsx('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Icon Button component (specialized button for icons)
export const IconButton = forwardRef(({
  className,
  variant = 'ghost',
  size = 'icon',
  children,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={clsx('rounded-full', className)}
      {...props}
    >
      {children}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

// Button group component
export function ButtonGroup({ className, children, ...props }) {
  return (
    <div
      className={clsx('inline-flex rounded-md shadow-sm', className)}
      role="group"
      {...props}
    >
      {children}
    </div>
  );
}

// Examples of specialized CRM buttons
export const CRMButtons = {
  // Call button
  CallButton: forwardRef(({ phone, className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="sm"
      className={clsx('text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/20', className)}
      onClick={() => window.open(`tel:${phone}`)}
      {...props}
    >
      <PhoneIcon className="mr-2 h-4 w-4" />
      {children || 'Call'}
    </Button>
  )),

  // Email button
  EmailButton: forwardRef(({ email, subject, body, className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="sm"
      className={clsx('text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/20', className)}
      onClick={() => {
        const mailtoLink = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
        window.open(mailtoLink);
      }}
      {...props}
    >
      <MailIcon className="mr-2 h-4 w-4" />
      {children || 'Email'}
    </Button>
  )),

  // WhatsApp button
  WhatsAppButton: forwardRef(({ phone, message, className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="sm"
      className={clsx('text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/20', className)}
      onClick={() => {
        const whatsappLink = `https://wa.me/${phone.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
        window.open(whatsappLink, '_blank');
      }}
      {...props}
    >
      <WhatsAppIcon className="mr-2 h-4 w-4" />
      {children || 'WhatsApp'}
    </Button>
  )),

  // Add to deal button
  AddToDealButton: forwardRef(({ onClick, className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="default"
      size="sm"
      className={clsx('bg-green-600 hover:bg-green-700 text-white', className)}
      onClick={onClick}
      {...props}
    >
      <PlusIcon className="mr-2 h-4 w-4" />
      {children || 'Add to Deal'}
    </Button>
  )),

  // Schedule meeting button
  ScheduleMeetingButton: forwardRef(({ onClick, className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="sm"
      className={clsx('text-purple-600 border-purple-300 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/20', className)}
      onClick={onClick}
      {...props}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {children || 'Schedule'}
    </Button>
  )),
};

// Export individual CRM buttons for easier imports
export const { CallButton, EmailButton, WhatsAppButton, AddToDealButton, ScheduleMeetingButton } = CRMButtons;

// Button with tooltip (requires tooltip component)
export const TooltipButton = forwardRef(({ tooltip, children, ...props }, ref) => {
  return (
    <div title={tooltip}>
      <Button ref={ref} {...props}>
        {children}
      </Button>
    </div>
  );
});

TooltipButton.displayName = 'TooltipButton';

// Icon components used in CRM buttons
const PhoneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const WhatsAppIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.749" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default Button;