import { InputProps } from '@/types';
import { useState } from 'react';
import { FaCheck, FaXmark } from 'react-icons/fa6';

export function Input({
  title,
  size = 4,
  value,
  required = false,
  readOnly = false,
  valid = 'default',
  placeholder,
  suport,
  onChange,
  icon,
  onClickIcon = () => {},
  options,
  keyObj = 0,
  showObj = 0,
}: InputProps) {
  const [isActive, setIsActive] = useState(false);
  const toggleIcon = () => {
    setIsActive(!isActive);
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    onChange(value);
    console.log(value);
  };

  const handleOnClickIcon = (e: any) => {
    toggleIcon();
    const value = e.target.value;
    onClickIcon(value);
  };

  const borderClass =
    valid === 'error'
      ? 'border-danger'
      : valid === 'success'
      ? 'border-success'
      : '';

  return (
    <div className={`position-relative mb-2 col-md-${size}`}>
      <label htmlFor={title}>
        {title} <span className="text-danger"> {required && '*'} </span>
      </label>
      <div className="d-flex gap-2">
        {icon && (
          <button
            className={`btn btn-icon ${isActive ? 'active' : ''}`}
            onClick={handleOnClickIcon}
          >
            {icon}
          </button>
        )}
        {options ? (
          <select
            className={`form-select ${borderClass} ${
              readOnly ? 'bg-gray-100' : ''
            }`}
            id={title}
            disabled={readOnly}
            onChange={handleInputChange}
            required={required}
            value={value}
          >
            <option selected>{placeholder}</option>
            {options.map((value, index) => (
              <option key={index} value={value[keyObj]}>
                {value[showObj]}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={`form-control ${borderClass} ${
              readOnly ? 'bg-gray-100' : ''
            }`}
            value={value}
            placeholder={placeholder}
            id={title}
            readOnly={readOnly}
            disabled={readOnly}
            onChange={handleInputChange}
            required={required}
          />
        )}
        {valid === 'error' && (
          <FaXmark
            className={`position-absolute end-0 translate-middle m-2 text-danger`}
            style={options ? { left: '100%', top: '55%' } : { top: '55%' }}
          />
        )}
        {valid === 'success' && (
          <FaCheck
            className="position-absolute end-0 translate-middle m-2 text-success"
            style={options ? { left: '100%', top: '55%' } : { top: '55%' }}
          />
        )}
        <p
          className={`mt-1 small ${
            suport
              ? valid === 'error'
                ? 'text-danger'
                : 'visible'
              : 'invisible'
          }`}
        >
          {suport}
        </p>
      </div>
    </div>
  );
}
