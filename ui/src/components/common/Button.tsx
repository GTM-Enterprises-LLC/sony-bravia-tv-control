import { ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps {
  label?: string;
  onClick: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function Button({
  label,
  onClick,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  className = '',
  children
}: ButtonProps) {
  const baseClasses = 'px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 min-h-[44px] shadow-lg';

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white active:scale-95',
    danger: 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        (disabled || loading) && disabledClasses,
        className
      )}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {icon && !loading && icon}
      {children || label}
    </button>
  );
}
