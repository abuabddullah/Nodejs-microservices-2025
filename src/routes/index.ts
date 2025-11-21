import express from 'express';
import { postRoutes } from '../app/modules/post/post.route';

const router = express.Router();
const routes: {
     path: string;
     route: any;
}[] = [
     {
          path: '/doc',
          route: postRoutes,
     },
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
