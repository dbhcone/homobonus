import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
// const {google} = require('googleapis');
import { UPLOADPATH } from '../../const';
import { AuthPlus } from 'googleapis-common';
// Service Account key file
const KEY_FILE_PATH = path.join(
  __dirname,
  '../../../../access/hb-events-kiki-7685233e5300.json'
);

// Full Access
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

const createAndUploadFile = async (
  filename: string,
  type?: string
) => {
  const driveService = google.drive({ version: 'v3', auth });

  const fileMetaData = {
    name: filename,
    parents: ['1k3o_LHOw0m_tsOA25s62RbpGteaeTVfN']
  };

  const filePath = path.join(UPLOADPATH, `/${filename}`);
  const media = {
    mimeType: type || 'image/png',
    body: fs.createReadStream(filePath),
  };

  try {
    let response = await driveService.files.create({
        media,
        fields: 'id',
      });
    
    //   switch (response.status) {
    //     case 200:
    //       console.log('Upload successful. Id = ', response.data.id);
    //       break;
    
    //     default:
    //       console.log('Error: Code ', response.status, response.statusText);
    //   }
    return {data: response.data.iconLink, status: response.statusText, code: response.status, message: "from google"}
  } catch (error: any) {
      return {message: error.error.message, status: 'error', code: 404, data: null}
  }
};

export { createAndUploadFile };
