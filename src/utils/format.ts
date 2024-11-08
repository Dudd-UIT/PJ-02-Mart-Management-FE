export function formatDate(dateString: string) {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
}

export const formatDateDMY = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // formats to dd/mm/yyyy
};

export const parseDateDMYtoYMD = (dateString: string) => {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};
