import Koa from 'koa';
import type { Context, Next } from 'koa';
import type Application from 'koa';

import KoaRouter from '@koa/router';
import type Router from '@koa/router';

import multer from '@koa/multer';

import path from 'path';
import fs from 'fs';

const app: Application = new Koa();
const router: Router = new KoaRouter();

//上传文件存放路径、及文件命名
const storage = multer.diskStorage({
  destination: async function (req: any, file, cb) {
    const fullpath = req._parsedUrl.path;
    const dirs = fullpath.split('/');
    const dir = dirs[dirs.length - 1];
    const safePath = `/upload/${dir}`;

    const res = fs.readdirSync(path.resolve(__dirname, './upload'));

    if (!res.includes(dir)) {
      console.log(path.resolve(__dirname, '.' + safePath));

      await fs.mkdirSync(path.resolve(__dirname, '.' + safePath));
    }

    cb(null, path.join(__dirname, safePath));
  },
  filename: function (req, file, cb) {
    let type = file.originalname.split('.')[1];
    cb(null, `${file.fieldname}-${Date.now().toString(16)}.${type}`);
  },
});

const upload = multer({ storage });

router.post('/upload-single/:dir', upload.single('image'), (ctx: Context, next: Next) => {
  const { filename } = ctx.file;
  const { dir } = ctx.params;
  ctx.body = {
    message: 'ok',
    url: `https://api.image.wuyupei.top/${dir}/${filename}`,
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(7777, () => {
  console.log('server is runing at http://localhost:7777');
});

// 访问地址
// https://api.image.wuyupei.top/qq/123546546.png
