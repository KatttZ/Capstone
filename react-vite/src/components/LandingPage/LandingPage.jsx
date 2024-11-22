
import {useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard";
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);

  return (
    <div>
      {user ? (
        <Dashboard />
      ) : (
        <div  className="landing-page">
          <div className="landing-content">
            <h1>Welcome to CardFlow</h1>
            <p>Organize your tasks with ease!</p>
              <button className="login-button" onClick={() => navigate("/login")}>
                Log in
              </button>
              <button className="signup-button" onClick={() => navigate("/signup")}>
                Sign up
              </button>
          </div>
        </div>
      )}
    </div>
  );
}

