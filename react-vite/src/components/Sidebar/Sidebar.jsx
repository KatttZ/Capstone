import { useSelector } from "react-redux";
import "./Sidebar.css";

export default function Sidebar({ onBoardsClick, onBoardSelect }) {
  const boards = [
    { id: 1, name: "Board 1" },
    { id: 2, name: "Board 2" },
    { id: 3, name: "Board 3" },
    { id: 4, name: "Board 4" },
  ];
  const user = useSelector((state) => state.session.user);

  return (
    <div className="sidebar">
      <h2>{user.username}&apos;s Workspace</h2>
      <h2 className="all-boards" onClick={onBoardsClick}>
        Boards
      </h2>
      <h2>My Boards</h2>
      <ul>
        {boards.map((board) => (
          <li
            key={board.id}
            className="sidebar-board"
            onClick={() => onBoardSelect(board.id)}
          >
            {board.name}
          </li>
        ))}
      </ul>
    </div>
  );
}