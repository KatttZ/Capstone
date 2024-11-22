import { useSelector } from "react-redux";




export default function Dashboard() {
  const user = useSelector((state) => state.session.user);

  return (
    <div className="dashboard">
      <h1>Welcome back, {user.username}!</h1>
      <p>Here’s your dashboard. Start managing your boards!</p>
    </div>
  );
}
