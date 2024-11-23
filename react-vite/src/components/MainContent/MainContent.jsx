// MainContent.jsx
import { useSelector } from "react-redux";
import "./MainContent.css";

export default function MainContent({ onBoardSelect }) {
  const boards = [
    { id: 1, name: "Board 1" },
    { id: 2, name: "Board 2" },
    { id: 3, name: "Board 3" },
    { id: 4, name: "Board 4" },
  ];
  const user = useSelector((state) => state.session.user);

  return (
    <div className="main-content">
      <h2>{user.username}&apos;s Workspace</h2>
      <h2>Boards</h2>
      <div className="board-grid">
        {boards.map((board) => (
          <div 
            key={board.id} 
            className="board-card" 
            onClick={() => onBoardSelect(board.id)}
          >
            {board.name}
          </div>
        ))}
        <div className="board-card create-board">+ Create New Board</div>
      </div>
    </div>
  );
}