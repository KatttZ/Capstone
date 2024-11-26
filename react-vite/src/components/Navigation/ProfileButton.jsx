import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from "../../redux/session";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <div style={{position:'relative'}}>
      <button className="profile-button" onClick={toggleMenu}>
        <FaUserCircle />
      </button>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user && (
            <>
              <li className="profile-username">Welcome! {user.username}</li>
              <li className="profile-email">{user.email}</li>
              <li>
                <button className="logout-button" onClick={logout}>Log Out</button>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
