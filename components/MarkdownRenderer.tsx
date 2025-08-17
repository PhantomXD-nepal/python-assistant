import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
// Note: You'll need to import KaTeX CSS in your app:
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Process the content to properly handle LaTeX math expressions
  const preprocessedContent = content
    // First, protect existing properly formatted math
    .replace(/\$\$[\s\S]*?\$\$/g, (match) => match) // Keep existing $$ blocks
    .replace(/\$[^$\n]*\$/g, (match) => match)      // Keep existing $ inline math
    
    // Convert LaTeX display math delimiters to $$
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$')
    .replace(/\\\\\[/g, '$$')
    .replace(/\\\\\]/g, '$$')
    
    // Convert LaTeX inline math delimiters to $
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    
    // Fix escaped backslashes in math expressions
    .replace(/\\\\/g, '\\')
    
    // Ensure proper spacing around display math
    .replace(/([^$])\$\$([^$])/g, '$1\n$$\n$2')
    .replace(/([^$])\$\$$/g, '$1\n$$')
    .replace(/^\$\$([^$])/g, '$$\n$1')
    
    // Clean up excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return (
    <div className="markdown-content">
      <ReactMarkdown 
        remarkPlugins={[remarkMath]} 
        rehypePlugins={[rehypeKatex]}
        components={{
          // Custom styling for better math rendering
          p: ({children}) => <p className="mb-4">{children}</p>,
          div: ({children}) => <div className="math-block my-4">{children}</div>,
        }}
      >
        {preprocessedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;