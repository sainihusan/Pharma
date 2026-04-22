import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingButton = ({ 
  loading, 
  disabled, 
  children, 
  className = '', 
  icon: Icon,
  loadingText,
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={`flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        Icon && <Icon size={18} />
      )}
      <span>{loading && loadingText ? loadingText : children}</span>
    </button>
  );
};

export default LoadingButton;
