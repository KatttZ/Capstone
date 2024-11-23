import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkGetAllBoards } from "../../redux/board";
import "./BoardDetails.css";

export default function BoardDetails({ boardId }) {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.board.allBoards.find((board) => board.id === boardId));

  useEffect(() => {
    dispatch(thunkGetAllBoards());
  },[dispatch])

  return (
    <div className="board-details">
      <h2>{board.title}</h2>
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