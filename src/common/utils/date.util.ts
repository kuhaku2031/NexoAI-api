
export function Formatdate(date: Date = new Date()): string {
  const locale = 'en-US';

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
}
