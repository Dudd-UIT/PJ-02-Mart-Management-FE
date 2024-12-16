import { InputProps } from '@/types';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import 'rsuite/DatePicker/styles/index.css';

export function Input({
  title,
  size = 4,
  value,
  required = false,
  readOnly = false,
  valid = 'default',
  placeholder,
  suport,
  disabled,
  onSelectedChange,
  onChange,
  icon,
  onClickIcon,
  options = [],
  keyObj = 'id',
  showObj = 'name',
  type,
}: InputProps) {
  // Separate handler for select changes
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = options.find(
      (option) => +option[keyObj] === +e.target.value,
    );

    if (selectedOption) {
      onSelectedChange?.(+selectedOption[keyObj]);
    }
  };

  // Separate handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleOnClickIcon = () => {
    if (onClickIcon) {
      onClickIcon();
    }
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
            disabled={disabled}
            type="button"
            className={`btn btn-icon`}
            onClick={handleOnClickIcon}
          >
            {icon}
          </button>
        )}
        {Array.isArray(options) && options.length > 0 ? ( // Check if options is an array with items
          <select
            className={`form-select ${borderClass} ${
              readOnly ? 'bg-gray-100' : ''
            }`}
            id={title}
            disabled={readOnly}
            onChange={handleSelectChange} // Use handleSelectChange for select element
            required={required}
            value={value}
          >
            {placeholder && (
              <option value={0} disabled>
                {placeholder}
              </option>
            )}
            {options.map((optionValue, index) => (
              <option
                key={index}
                value={optionValue[keyObj] as string | number}
              >
                {optionValue[showObj] as string}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={`form-control ${borderClass} ${
              readOnly ? 'bg-gray-100' : ''
            }`}
            type={type}
            value={value}
            placeholder={placeholder}
            id={title}
            readOnly={readOnly}
            disabled={readOnly}
            onChange={handleInputChange} // Use handleInputChange for input element
            required={required}
            style={{ paddingTop: '0.5rem', paddingBottom: '0.3rem' }}
          />
        )}
        {valid === 'error' && (
          <FaXmark
            className="position-absolute end-0 translate-middle m-2 text-danger"
            style={
              options.length ? { left: '100%', top: '55%' } : { top: '55%' }
            }
          />
        )}
        {valid === 'success' && (
          <FaCheck
            className="position-absolute end-0 translate-middle m-2 text-success"
            style={
              options.length ? { left: '100%', top: '55%' } : { top: '55%' }
            }
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

type SelectInputProps = {
  label?: string;
  value: string | number;
  options: { label: string; value: string | number }[]; // Các lựa chọn với `label` để hiển thị và `value` là giá trị thực
  onChange: (value: string | number) => void;
};

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <select
        className="form-select mb-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
