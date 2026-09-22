import { useState, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useI18n } from '../i18n';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span>{title ?? language}</span>
        <button className="code-block-copy" onClick={handleCopy} type="button">
          {copied ? t('common.copied') : t('common.copy')}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={prism}
        showLineNumbers={false}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#f8fafc',
          fontSize: '0.8125rem',
          lineHeight: 1.6,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;
