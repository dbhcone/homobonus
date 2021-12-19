const FROM = 'HB EVENTS';
const USER = 'dev.dbhcone';
const API_KEY = '0ea40277f122f6b21956af3c81b5a4aa';
const BASE_URL = 'https://sms.dtechghana.com/api/v1/messages';

const AUTH_PWD = Buffer.from(`${USER}:${API_KEY}`).toString('base64');
const headers = {
  // 'Content-Type': 'application/json',
  Authorization: `Basic ${AUTH_PWD}`,
  Accept: 'application/json',
};

import axios from 'axios';

const sendDtechSms = async (
  msg: string,
  recipient: string,
  reference?: string
) => {
  const data = { content: msg, to: recipient, from: FROM, reference };

  try {
    const resp = await axios.post(BASE_URL, data, {
      headers,
    });

    return {
      message: resp.data.MessageStatus,
      status: resp.statusText,
      code: resp.status,
      data: resp.data,
    };
  } catch (error: any) {
    return { message: error.message, status: 'error', code: error.name };
  }
};

const sendEaziProSms = (msg: string, recipient: string) => {};

/**
 * Tries to manipulate a string number to an intl standart (Gh only for now)
 * @param rawnumber string input of raw format of number
 * @returns a number representing the intl telephone number
 */
const intlTelNumberGh = (rawnumber: string) => {
  const regex = /^233[0-9]{9}$/;
  let test = regex.test(rawnumber);
  if (test) return rawnumber;

  let num = rawnumber;
  if(rawnumber.startsWith('0')) {
    return num = `233${num.slice(1, 10)}`;
  }
  return null;
}

export { sendDtechSms, sendEaziProSms, intlTelNumberGh };
