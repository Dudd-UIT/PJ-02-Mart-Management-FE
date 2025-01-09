export function formatDate(dateString: string) {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
}

export const formatDateDMY = (dateString: string) => {
  if (!dateString) return 'Invalid Date'; // Handle empty or invalid dates
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date'; // Handle invalid date objects
  return date.toLocaleDateString('en-GB'); // formats to dd/mm/yyyy
};

export const parseDateDMYtoYMD = (dateString: string) => {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

export const formatCurrency = (value: number): string => {
  const absValue = Math.abs(value); // Lấy giá trị tuyệt đối của số
  let formattedValue: string;

  if (absValue >= 1_000_000_000) {
    formattedValue = `${(absValue / 1_000_000_000).toFixed(1)}B`;
  } else if (absValue >= 1_000_000) {
    formattedValue = `${(absValue / 1_000_000).toFixed(1)}M`;
  } else {
    formattedValue = absValue.toLocaleString('vi-VN');
  }

  return value < 0 ? `-${formattedValue}` : formattedValue;
};

export const formatCurrencyLong = (value: number): string => {
  const absValue = Math.abs(value); // Lấy giá trị tuyệt đối của số
  let formattedValue: string;
    formattedValue = absValue.toLocaleString('vi-VN');
  return value < 0 ? `-${formattedValue}` : formattedValue;
};
