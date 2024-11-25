import { useDispatch } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import ConfirmDeletionModal from "../ConfirmDeletionModal";
import { thunkGetBoardLists } from "../../redux/list";
import './ListDetails.css';

export default function ListDetails({ list, boardId }) {
  const dispatch = useDispatch();

  const handleListDelete = async () => {
    await dispatch(thunkGetBoardLists(boardId));
  };

  return (
    <div className="list">
      <div className="list-header">
        <h3>{list.title}</h3>
        <div className="list-actions">
          <OpenModalButton
            modalComponent={
              <ConfirmDeletionModal 
                itemId={list.id} 
                itemType='list'
                onDeleteSuccess={handleListDelete}
                boardId={boardId}
              />
            }
            buttonText="Delete" 
            onButtonClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
      
      <div className="cards-container">
        {/* Cards will be added here later */}
      </div>
    </div>
  );
}