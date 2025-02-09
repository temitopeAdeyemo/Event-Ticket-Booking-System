import moment from 'moment-timezone';

export const minutesToSeconds = (minutes: number) => minutes * 60;
export function getFormattedDate(date: Date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export const getCurrentTime = () => moment().tz('Africa/Lagos').format('YYYY-MM-DD HH:mm:ss');
