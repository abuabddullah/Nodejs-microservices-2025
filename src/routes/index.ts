import express from 'express';
import { UserRouter } from '../app/modules/user/user.route';

const router = express.Router();
const routes = [
     {
          path: '/identity',
          route: UserRouter,
     },
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
