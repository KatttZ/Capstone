import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkGetAllBoards } from "../../redux/board";
import OpenModalButton from "../OpenModalButton";
import CreateBoardModal from "../CreateBoardModal";
import "./MainContent.css";

export default function MainContent({ onBoardSelect }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const boards = useSelector((state) => state.board.allBoards);

  useEffect(() => {
    dispatch(thunkGetAllBoards());
  }, [dispatch]);

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
            {board.title}
          </div>
        ))}

        <OpenModalButton
          modalComponent={<CreateBoardModal />}
          buttonText="+ Create New Board"
        />
      </div>
    </div>
  );
}
