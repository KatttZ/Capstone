import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {

  return (
    <nav className="navigation-bar">
      <ul className="nav-bar-elements">
        <li className='logo-container'>
          <NavLink to="/">
            <img src='/logo.png' alt="Logo" className="logo" />
            CardFlow
          </NavLink>
        </li>

        <li>
          <ProfileButton />
        </li>
    </ul>

    </nav>
   
  );
}

export default Navigation;
