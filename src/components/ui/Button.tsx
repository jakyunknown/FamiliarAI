import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  type = 'button',
  className = '',
}) => {
  let baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ';

  // Variant styling
  if (variant === 'primary') {
    baseClasses += 'bg-green-400 hover:bg-green-500 focus:ring-green-300 text-gray-900 rounded-lg ';
  } else {
    baseClasses += 'bg-gray-100 hover:bg-gray-200 focus:ring-gray-200 text-gray-700 rounded-lg ';
  }

  // Size styling - default to large for primary actions per PRD
  if (size === 'small') {
    baseClasses += 'text-sm px-4 py-2 ';
  } else if (size === 'large') {
    baseClasses += 'text-base px-6 py-3 ';
  } else {
    baseClasses += 'text-base px-5 py-2.5 ';
  }

  return (
    <button
      type={type}
      className={`${baseClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
