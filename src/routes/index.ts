import express from 'express';

const router = express.Router();
const routes: {
     path: string;
     route: any;
}[] = [
     // {
     //      path: '/users',
     //      route: UserRouter,
     // },
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
