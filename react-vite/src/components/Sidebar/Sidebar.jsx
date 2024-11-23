import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkGetAllBoards} from "../../redux/board";
import OpenModalButton from "../OpenModalButton";
import ConfirmDeletionModal from "../ConfirmDeletionModal";
import "./Sidebar.css";


export default function Sidebar({ onBoardsClick, onBoardSelect }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const boards = useSelector((state) => state.board.allBoards || []);

  useEffect(() => {
    dispatch(thunkGetAllBoards());
  }, [dispatch]);

  const handleBoardSelect = (id) => {
    onBoardSelect(id);
  };

  const handleBoardsClick = () => {
    onBoardsClick();
  };



  return (
    <div className="sidebar">
      <h2>{user.username}&apos;s Workspace</h2>
      <h2 className="all-boards" onClick={handleBoardsClick}>
        Boards
      </h2>
      <h2>My Boards</h2>
      <ul>
        {boards.length > 0 ? (
          boards.map((board) => (
            <li
              key={board.id}
              className="sidebar-board"
              onClick={() => handleBoardSelect(board.id)}
            >
              {board.title}
              <OpenModalButton 
                modalComponent={<ConfirmDeletionModal boardId={board.id} />}
                buttonText="Delete"
              />
            </li>
          ))
        ) : (
          <p className="no-boards">No boards available. Create a new board to get started!</p>
        )}
      </ul>
    </div>
  );
}
