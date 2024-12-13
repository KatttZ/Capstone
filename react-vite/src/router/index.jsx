import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import ChatPage from '../components/ChatPage';
import ChatRoom from '../components//ChatRoom';
import Layout from './Layout';
import LandingPage from '../components/LandingPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path:"chat",
        element: <ChatPage />,
      },
      {
        path:"chat/:roomCode",
        element: <ChatRoom />,
      }
    ],
  },
]);