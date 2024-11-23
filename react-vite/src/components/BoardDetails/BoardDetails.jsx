// import { useSelector } from "react-redux";
import "./BoardDetails.css";

export default function BoardDetails({ boardId }) {
    const boards = [
        { id: 1, name: "Board 1" },
        { id: 2, name: "Board 2" },
        { id: 3, name: "Board 3" },
        { id: 4, name: "Board 4" },
      ];

  const board = boards.find((board) => board.id === boardId);

  if (!board) return <p>Board not found!</p>;

  return (
    <div className="board-details">
      <h2>{board.name}</h2>
      {/* <ul>
        {board.lists.map((list) => (
          <li key={list.id} className="list-item">
            {list.name}
          </li>
        ))}
      </ul> */}
    </div>
  );
}