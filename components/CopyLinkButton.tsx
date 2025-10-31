'use client';

import { useState } from 'react';

interface CopyLinkButtonProps {
  url: string;
  className?: string;
  children?: React.ReactNode;
}

export default function CopyLinkButton({ url, className, children }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Fallback copy failed:', e);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className={className}
    >
      {copied ? '✅ Copied!' : children}
    </button>
  );
}
