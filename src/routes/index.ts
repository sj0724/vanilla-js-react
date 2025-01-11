import NotFoundPage from '@/NotFoundPage';
import DashBoardPage from '@/pages/DashBoard';
import MainPage from '@/pages/Main';
import DetailPage from '@/pages/Detail';

export const routes = [
  {
    path: '/',
    element: MainPage,
    errorElement: NotFoundPage,
    children: [
      {
        path: 'dashboard',
        element: DashBoardPage,
      },
      {
        path: 'detail',
        children: [
          {
            path: ':id',
            element: DetailPage,
          },
        ],
      },
    ],
  },
];
