import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import homepageIcon from '/home/dev/Рабочий стол/Messanger/my-messenger/src/assets/homepage.svg';
import gLogo from '/home/dev/Рабочий стол/Messanger/my-messenger/src/assets/g.svg';
import g1Logo from '/home/dev/Рабочий стол/Messanger/my-messenger/src/assets/g1.svg';
import sLogo from '/home/dev/Рабочий стол/Messanger/my-messenger/src/assets/s.svg';
import logoutIcon from '/home/dev/Рабочий стол/Messanger/my-messenger/src/assets/logout.svg'; 
import profileIcon from '/home/dev/Рабочий стол/Messanger/my-messenger/src/assets/profileicon.svg';
import { useAuth } from '/home/dev/Рабочий стол/Messanger/my-messenger/src/components/Auth/AuthContext.jsx';
import { logout } from '/home/dev/Рабочий стол/Messanger/my-messenger/src/api/api.js'; // Импортируем функцию logout

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
      window.location.href = '/login';
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link to="/" className={styles.logoContainer}>
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
            <Link to="/" className={styles.navbarLink}>
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
                <Link to="/login" className={styles.navbarLink}>Вход</Link>
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
