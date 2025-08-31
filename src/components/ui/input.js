'use client';

import { forwardRef, useState } from 'react';
import { clsx } from 'clsx';

// Base Input component
const Input = forwardRef(({
  className,
  type = 'text',
  error,
  disabled,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      className={clsx(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-red-500 focus-visible:ring-red-500',
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    />
  );
});

Input.displayName = 'Input';

// Textarea component
export const Textarea = forwardRef(({
  className,
  error,
  disabled,
  ...props
}, ref) => {
  return (
    <textarea
      className={clsx(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-red-500 focus-visible:ring-red-500',
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

// Select component
export const Select = forwardRef(({
  className,
  error,
  disabled,
  children,
  placeholder,
  ...props
}, ref) => {
  return (
    <select
      className={clsx(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-red-500 focus-visible:ring-red-500',
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
});

Select.displayName = 'Select';

// Form Field wrapper component
export function FormField({ 
  label, 
  error, 
  required, 
  children, 
  className,
  description,
  ...props 
}) {
  return (
    <div className={clsx('space-y-2', className)} {...props}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

// Phone Input component with formatting
export const PhoneInput = forwardRef(({
  className,
  value,
  onChange,
  country = 'US',
  ...props
}, ref) => {
  const [displayValue, setDisplayValue] = useState(value || '');

  const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      const intlCode = (match[1] ? '+1 ' : '');
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    
    return phoneNumberString;
  };

  const handleChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setDisplayValue(formatted);
    onChange?.(e);
  };

  return (
    <Input
      {...props}
      ref={ref}
      type="tel"
      value={displayValue}
      onChange={handleChange}
      placeholder="+1 (555) 123-4567"
      className={className}
    />
  );
});

PhoneInput.displayName = 'PhoneInput';

// Email Input with validation
export const EmailInput = forwardRef(({
  className,
  onValidation,
  ...props
}, ref) => {
  const [isValid, setIsValid] = useState(true);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(email);
    setIsValid(valid);
    onValidation?.(valid);
    return valid;
  };

  const handleBlur = (e) => {
    if (e.target.value) {
      validateEmail(e.target.value);
    }
    props.onBlur?.(e);
  };

  return (
    <Input
      {...props}
      ref={ref}
      type="email"
      onBlur={handleBlur}
      className={clsx(
        !isValid && 'border-red-500',
        className
      )}
    />
  );
});

EmailInput.displayName = 'EmailInput';

// Currency Input component
export const CurrencyInput = forwardRef(({
  className,
  value,
  onChange,
  currency = 'USD',
  ...props
}, ref) => {
  const [displayValue, setDisplayValue] = useState(
    value ? new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(value) : ''
  );

  const handleChange = (e) => {
    const numericValue = e.target.value.replace(/[^\d.]/g, '');
    const formatted = numericValue ? new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(parseFloat(numericValue)) : '';
    
    setDisplayValue(formatted);
    onChange?.(parseFloat(numericValue) || 0);
  };

  return (
    <Input
      {...props}
      ref={ref}
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder="$0"
      className={className}
    />
  );
});

CurrencyInput.displayName = 'CurrencyInput';

// Date Input component
export const DateInput = forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    <Input
      {...props}
      ref={ref}
      type="date"
      className={className}
    />
  );
});

DateInput.displayName = 'DateInput';

// Search Input with icon
export const SearchInput = forwardRef(({
  className,
  onSearch,
  placeholder = "Search...",
  ...props
}, ref) => {
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
    props.onChange?.(e);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch?.('');
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        {...props}
        ref={ref}
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={clsx('pl-9 pr-9', className)}
      />
      {searchValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

// Tag Input component for adding multiple tags
export function TagInput({ 
  value = [], 
  onChange, 
  placeholder = "Add tags...",
  className 
}) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className={clsx(
      'flex min-h-[40px] w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
      className
    )}>
      {value.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs text-primary-foreground"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:bg-primary-foreground/20 rounded-full p-0.5"
          >
            <XIcon className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 border-0 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
      />
    </div>
  );
}

// CRM-specific form components
export const CRMInputs = {
  // Lead source selector
  LeadSourceSelect: forwardRef((props, ref) => (
    <Select ref={ref} placeholder="Select lead source..." {...props}>
      <option value="website">Website</option>
      <option value="social_media">Social Media</option>
      <option value="linkedin">LinkedIn</option>
      <option value="referral">Referral</option>
      <option value="cold_email">Cold Email</option>
      <option value="trade_show">Trade Show</option>
      <option value="advertising">Advertising</option>
      <option value="other">Other</option>
    </Select>
  )),

  // Deal stage selector
  DealStageSelect: forwardRef((props, ref) => (
    <Select ref={ref} placeholder="Select stage..." {...props}>
      <option value="lead">Lead</option>
      <option value="qualified">Qualified</option>
      <option value="proposal">Proposal</option>
      <option value="negotiation">Negotiation</option>
      <option value="closed-won">Closed Won</option>
      <option value="closed-lost">Closed Lost</option>
    </Select>
  )),

  // Priority selector
  PrioritySelect: forwardRef((props, ref) => (
    <Select ref={ref} placeholder="Select priority..." {...props}>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="urgent">Urgent</option>
    </Select>
  )),

  // Activity type selector
  ActivityTypeSelect: forwardRef((props, ref) => (
    <Select ref={ref} placeholder="Select activity type..." {...props}>
      <option value="call">Phone Call</option>
      <option value="email">Email</option>
      <option value="meeting">Meeting</option>
      <option value="whatsapp">WhatsApp</option>
      <option value="task">Task</option>
      <option value="note">Note</option>
    </Select>
  )),
};

// Export individual CRM inputs
export const { LeadSourceSelect, DealStageSelect, PrioritySelect, ActivityTypeSelect } = CRMInputs;

// Checkbox component
export const Checkbox = forwardRef(({
  className,
  checked,
  onCheckedChange,
  disabled,
  ...props
}, ref) => {
  return (
    <input
      type="checkbox"
      className={clsx(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      disabled={disabled}
      {...props}
    />
  );
});

Checkbox.displayName = 'Checkbox';

// Form component for handling form state
export function Form({ onSubmit, className, children, ...props }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      className={clsx('space-y-4', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </form>
  );
}

// Icon components
const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default Input;