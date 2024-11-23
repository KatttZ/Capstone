import { useDispatch} from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteBoard } from "../../redux/board";
import "./ConfirmDeletionModal.css";


function ConfirmDeletionModal({boardId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
  
  
    const handleDelete = async () => {
  
      await dispatch(thunkDeleteBoard(boardId));
      
        closeModal();
      
    };
  
    return (
      <div className="Confirm-delete-modal">
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to delete this board?</p>
        <div>
            <button onClick={handleDelete} type="submit">Delete</button>
            <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    );
  }
  
  export default ConfirmDeletionModal;