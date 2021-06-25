import React from 'react';
import { Button } from 'antd';
import styles from './style.module.less';
const HomePage = () => {
    return (<div className={styles['home-page']}>
      <h2>Hello,React!</h2>
      <Button type="primary">GOT IT !!!</Button>
    </div>);
};
export default HomePage;
