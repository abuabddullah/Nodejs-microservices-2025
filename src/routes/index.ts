import express from 'express';
import { mediaRoutes } from '../app/modules/media/media.route';

const router = express.Router();
const routes: {
     path: string;
     route: any;
}[] = [
     {
          path: '/doc',
          route: mediaRoutes,
     },
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
