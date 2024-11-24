import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteBoard } from "../../redux/board";
import "./ConfirmDeletionModal.css";

function ConfirmDeletionModal({ boardId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = () => {
    dispatch(thunkDeleteBoard(boardId));
    closeModal();
  };

  return (
    <div className="Confirm-delete-modal">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this board?</p>
      <div>
        <button onClick={handleDelete} type="submit">
          Yes
        </button>
        <button onClick={closeModal}>No</button>
      </div>
    </div>
  );
}

export default ConfirmDeletionModal;
