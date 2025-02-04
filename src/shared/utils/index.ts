import moment from 'moment-timezone';

export const generateReferralId = () => {
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};
export const generateOTP = (length: number = 8) => {
  const charset = '0123456789';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

export const minutesToSeconds = (minutes: number) => minutes * 60;

export const commarisedAmount = (amount: string) => {
  let arr = [];
  let strr = [];
  for (let i = amount.length - 1; i >= 0; i--) {
    strr.unshift(amount[i]);
    if (strr.length == 3) {
      arr.unshift(strr.join(''));
      strr = [];
    }
  }
  if (strr.length > 0) {
    arr.unshift(strr.join(''));
  }
  return arr.join();
};

export function getFormattedDate(date: Date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export const getCurrentTime = () => moment().tz('Africa/Lagos').format('YYYY-MM-DD HH:mm:ss');
