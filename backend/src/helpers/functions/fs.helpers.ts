import fs from 'fs';
import config from 'config';
import sharing, { Dropbox, Error, files } from 'dropbox'; // eslint-disable-line no-unused-vars
import path from 'path';
import { UPLOADPATH } from '../../const';
import { updateFlyerUrl } from '../../controllers/event.controller';
const APPROOT = <string>config.get('APPROOT');

const deletePhoto = (fileName?: string) => {
  fs.unlink(
    path.join(UPLOADPATH, `/${fileName}`),
    (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.log(err.name, err.code, err.message);
        return false;
      } else {
        return true;
      }
    }
  );
};

const uploadFile = (fileName: string, eventId: string) => {
  const dbx = new Dropbox({
    accessToken:
      'hoOHxRjEi_MAAAAAAAAAAcIr6Vcc3VS-4xBdtTwuD0bWwpcxRsNLxpU0SUSV-Lb-',
  });
  fs.readFile(path.join(UPLOADPATH, `/${fileName}`), async (err, contents) => {
    if (err) {
      console.log('Error reading file: ', err);
    }
    try {
      const response = await dbx.filesUpload({
        path: `/${fileName}`,
        contents,
      });
      console.log('upload response', response);
      let url = (
        await dbx.sharingCreateSharedLinkWithSettings({
          path: response.result?.path_display as string,
          settings: {allow_download: true}
        })
      ).result.url;
      let upd = await updateFlyerUrl(eventId, url);
    } catch (uploadErr: any) {
      console.log('upload error', uploadErr);
    }
  });
};

export { deletePhoto, uploadFile };
