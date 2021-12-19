import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { ContactUs } from '../controllers/index.controller';
import qr from 'qrcode'
const router = express.Router();

/* GET home page. */
router.get('/test', function (req: Request, res: Response, next: NextFunction) {
  // const statdir = path.join(__dirname, 'dist/fe/index.html');
  // res.sendFile(statdir);
  const dir = __dirname;
  const me = path.join(__dirname, '../../public/uploads');
  res
    .status(200)
    .json({
      message: 'Testing endpoint hit successfully',
      status: 'ok',
      code: 200,
      data: [dir, me]
    });
});

router.post('/getqrcode', (req: Request, res: Response, next: NextFunction) => {
  const content = JSON.stringify(req.body);
  console.log('content', content);
  qr.toDataURL(content, (err, src) => {
    if (err) res.send("Error occured");

    res.status(201).json({src});
  })

  // res.status(200).json({message: 'scan completed!'})
})

router.post('/contactus', ContactUs)

export { router as indexRouter };
