import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkGetAllBoards } from "../../redux/board";
import "./Sidebar.css";

export default function Sidebar({ onBoardsClick, onBoardSelect }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const boards = useSelector((state) => state.board.allBoards);

  useEffect(() => {
    dispatch(thunkGetAllBoards());
  },[dispatch])

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
            {board.title}
          </li>
        ))}
      </ul>
    </div>
  );
}