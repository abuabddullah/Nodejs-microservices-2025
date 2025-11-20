import express from 'express';
import { AuthRouter } from '../app/modules/auth/auth.route';
import { UserRouter } from '../app/modules/user/user.route';

const router = express.Router();
const routes = [
     {
          path: '/user',
          route: UserRouter,
     },
     {
          path: '/auth',
          route: AuthRouter,
     },
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
