import React, { useRef } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, List, ListOrdered, Table } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const formatDoc = (cmd: string, val: string | undefined = undefined) => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      formatDoc('createLink', url);
    }
  };

  const insertTable = () => {
    const tableHTML = `<table border="1" style="border-collapse: collapse; width: 100%; margin: 8px 0;"><thead><tr><th style="padding: 8px; border: 1px solid #475569;">Header 1</th><th style="padding: 8px; border: 1px solid #475569;">Header 2</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #475569;">Cell 1</td><td style="padding: 8px; border: 1px solid #475569;">Cell 2</td></tr></tbody></table>`;
    formatDoc('insertHTML', tableHTML);
  };

  return (
    <div className="rich-editor">
      <div className="rich-toolbar">
        <button type="button" className="rich-btn" onClick={() => formatDoc('bold')} title="Bold">
          <Bold size={16} />
        </button>
        <button type="button" className="rich-btn" onClick={() => formatDoc('italic')} title="Italic">
          <Italic size={16} />
        </button>
        <button type="button" className="rich-btn" onClick={() => formatDoc('underline')} title="Underline">
          <Underline size={16} />
        </button>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        <select
          className="form-select"
          style={{ width: 'auto', padding: '2px 6px', fontSize: '0.8rem' }}
          onChange={(e) => formatDoc('formatBlock', e.target.value)}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Header 1</option>
          <option value="h2">Header 2</option>
          <option value="h3">Header 3</option>
        </select>
        <select
          className="form-select"
          style={{ width: 'auto', padding: '2px 6px', fontSize: '0.8rem' }}
          onChange={(e) => formatDoc('fontSize', e.target.value)}
        >
          <option value="3">Normal</option>
          <option value="1">Small</option>
          <option value="5">Large</option>
          <option value="7">Extra Large</option>
        </select>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        <button type="button" className="rich-btn" onClick={() => formatDoc('justifyLeft')} title="Align Left">
          <AlignLeft size={16} />
        </button>
        <button type="button" className="rich-btn" onClick={() => formatDoc('justifyCenter')} title="Align Center">
          <AlignCenter size={16} />
        </button>
        <button type="button" className="rich-btn" onClick={() => formatDoc('justifyRight')} title="Align Right">
          <AlignRight size={16} />
        </button>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
        <button type="button" className="rich-btn" onClick={() => formatDoc('insertUnorderedList')} title="Bullet List">
          <List size={16} />
        </button>
        <button type="button" className="rich-btn" onClick={() => formatDoc('insertOrderedList')} title="Numbered List">
          <ListOrdered size={16} />
        </button>
        <button type="button" className="rich-btn" onClick={insertLink} title="Insert Link">
          <LinkIcon size={16} />
        </button>
        <button type="button" className="rich-btn" onClick={insertTable} title="Insert Table">
          <Table size={16} />
        </button>
      </div>
      <div
        ref={editorRef}
        className="rich-textarea"
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />
    </div>
  );
};
