import { Route, Redirect } from 'react-router-dom';
import { DashboardOutlined } from '@ant-design/icons';
import DashboardPage from '@/pages/dashboard';

const router = [
  {
    key: 'index',
    path: '/',
    redirect: '/dashboard',
  },
  {
    key: 'dashboard',
    path: '/dashboard',
    name: '工作台',
    icon: <DashboardOutlined />,
    component: DashboardPage,
  },
];

export function renderRouter(route: any[]) {
  const res: any[] = [];

  route.forEach((item) => {
    const { key, path, component, redirect, routes, ...rest } = item;
    if (Array.isArray(routes)) {
      res.push(...renderRouter(routes));
    } else if (redirect != null) {
      res.push(
        <Route exact key={key} path={path} {...rest} render={() => <Redirect to={redirect} />} />,
      );
    } else {
      res.push(<Route exact key={key} path={item.path} component={item.component} {...rest} />);
    }
  });

  return res;
}

export default router;
