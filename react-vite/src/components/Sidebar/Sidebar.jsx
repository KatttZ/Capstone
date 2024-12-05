import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { thunkGetAllBoards } from "../../redux/board";
import OpenModalButton from "../OpenModalButton";
import CreateItemModal from "../CreateItemModal";
import ConfirmDeletionModal from "../ConfirmDeletionModal";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import "./Sidebar.css";

export default function Sidebar({ onBoardsClick, onBoardSelect }) {
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const handleMembersClick = () => {
    window.alert("Feature Coming Soon!");
  }

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>{user.username}&apos;s Workspace</h2>
        <div className="collapse-icon" onClick={handleCollapse}>
          {isCollapsed ? <FaArrowRight /> : <FaArrowLeft />}
        </div>
      </div>
      {!isCollapsed && (
        <>
          <h3 className="all-boards" onClick={handleBoardsClick}>
            Boards
          </h3>
          <h3 className="members" onClick={handleMembersClick}>
            Members
          </h3>
          <div className="my-boards">
          <h2>Your Boards</h2> 
          <OpenModalButton
          modalComponent={<CreateItemModal type="board"/>}
          buttonText={<FaPlus />}
          />
          </div>
     
          <ul>
            {boards.length > 0 ? (
              boards.map((board) => (
                <li key={board.id} className="sidebar-board" onClick={() => handleBoardSelect(board.id)}>
                  <span >
                    {board.title}
                  </span>
                  <div className="board-actions" onClick={(e) => e.stopPropagation()} >
                    <OpenModalButton
                      modalComponent={
                        <ConfirmDeletionModal
                          itemId={board.id}
                          itemType="board"
                        />
                      }
                      buttonText="Delete"
                    />
                  </div>
                </li>
              ))
            ) : (
              <p className="no-boards">
                No boards available. Create a new board to get started!
              </p>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
