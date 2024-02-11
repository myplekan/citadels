import './Header.css';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <div className="header">
      <div className="header__sign-in">
        <Link to='/sign-in' className='header__sign-in-link'>Sign in</Link>
      </div>
    </div>
  );
};
