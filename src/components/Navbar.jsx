import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import homepageIcon from './../assets/homepage.svg';
import gLogo from './../assets/g.svg';
import g1Logo from './../assets/g1.svg';
import sLogo from './../assets/s.svg';
import logoutIcon from './../assets/logout.svg'; 
import profileIcon from './../assets/profileicon.svg';
import { useAuth } from './../components/Auth/AuthContext.jsx';
import { logout } from './../api/api.js';

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [authState, setAuthState] = useState(isAuthenticated);

  useEffect(() => {
    setAuthState(isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout(); // Вызываем функцию logout из API
      localStorage.setItem('isAuthenticated', 'false');
      setIsAuthenticated(false);
      // Перенаправляем на страницу /login после успешного logout
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link to="/home" className={styles.logoContainer}>
          {authState && (
            <>
              <img src={gLogo} alt="G" className={styles.logo} />
              <img src={g1Logo} alt="G" className={styles.logo} />
              <img src={sLogo} alt="S" className={styles.logo} />
            </>
          )}
        </Link>
        
        <div className={styles.navbarLinks}>
          {authState && (
            <Link to="/home" className={styles.navbarLink}>
              <img src={homepageIcon} alt="Домашняя страница" className={styles.navbarIcon} />
            </Link>
          )}
          {authState && (
            <Link to="/profile" className={styles.navbarLink}>
              <img src={profileIcon} alt="Профиль" className={styles.navbarIcon} />
            </Link>
          )}
          <div className={styles.rightNavbarLinks}>
            {authState ? (
              <div className={styles.navbarLink} onClick={handleLogout}>
                <img src={logoutIcon} alt="Logout" className={styles.navbarIcon} />
              </div>
            ) : (
              <>
                <Link to="/" className={styles.navbarLink}>Вход</Link>
                <Link to="/register" className={styles.navbarLink}>Регистрация</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
