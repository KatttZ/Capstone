import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { thunkGetAllBoards } from "../../redux/board";
import OpenModalButton from "../OpenModalButton";
import CreateItemModal from "../CreateItemModal";
import "./MainContent.css";
import SearchBoard from "../SearchBoards";

export default function MainContent({ onBoardSelect }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const boards = useSelector((state) => state.board.allBoards);
  const [searchResults, setSearchResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    if (!searchActive) {
      dispatch(thunkGetAllBoards());
    }
  }, [dispatch, searchActive]);

  const boardsToShow = searchActive ? searchResults : boards;

  return (
    <div className="main-content">
      <h1>{user.username}&apos;s Workspace</h1>
      <h2>Boards</h2>
      <div className="search-board">
      <label>Search by Title</label>
      <SearchBoard
        setSearchResults={setSearchResults}
        setSearchActive={setSearchActive}
      />
      </div>

      <div className="board-grid">
        <div className="add-board-container">
          <OpenModalButton
            modalComponent={<CreateItemModal type="board" />}
            buttonText="+ Create New Board"
          />
        </div>
        {boardsToShow.length > 0 &&
          boardsToShow.map((board) => (
            <div
              key={board.id}
              className="board-card"
              onClick={() => onBoardSelect(board.id)}
            >
              {board.title}
            </div>
          ))}
      </div>
    </div>
  );
}
