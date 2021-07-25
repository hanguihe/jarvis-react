import { useEffect, useState } from 'react';
import { message } from 'antd';
import { fetchAuthInfo } from '@/services/auth';
import styles from './style.module.less';

const DashboardPage = () => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    fetchAuthInfo()
      .then((res) => {
        if (!res.success) {
          message.error(res.message);
          return;
        }
        setUserInfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.dashboard}>
      <pre>{JSON.stringify(userInfo, null, 2)}</pre>
    </div>
  );
};

export default DashboardPage;
