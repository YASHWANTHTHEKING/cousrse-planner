import React from 'react';

interface DatePickerProps {
  value: string; // ISO date string or dd-MMM-yyyy
  onChange: (isoDate: string) => void;
  label?: string;
  required?: boolean;
}

export function formatDateToDdMmmYyyy(dateInput: string | Date): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label, required }) => {
  // Convert current ISO or string to YYYY-MM-DD for native input
  let rawInputValue = '';
  if (value) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      rawInputValue = d.toISOString().split('T')[0];
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoVal = e.target.value;
    onChange(isoVal);
  };

  const formattedDisplay = value ? formatDateToDdMmmYyyy(value) : '';

  return (
    <div className="form-group">
      {label && <label className="form-label">{label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="date"
          className="form-input"
          value={rawInputValue}
          onChange={handleInputChange}
          required={required}
          style={{ cursor: 'pointer' }}
        />
        {formattedDisplay && (
          <span
            style={{
              position: 'absolute',
              right: '40px',
              pointerEvents: 'none',
              background: 'var(--primary-light)',
              color: '#a5b4fc',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {formattedDisplay}
          </span>
        )}
      </div>
    </div>
  );
};
