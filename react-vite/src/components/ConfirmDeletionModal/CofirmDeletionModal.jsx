import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteBoard } from "../../redux/board";
import { thunkDeleteList } from "../../redux/list";
import "./ConfirmDeletionModal.css";

function ConfirmDeletionModal({ itemId, itemType, onDeleteSuccess }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    if (itemType === 'board') {
      await dispatch(thunkDeleteBoard(itemId));
    }
    if (itemType === 'list') {
      await dispatch(thunkDeleteList(itemId));
      if (onDeleteSuccess) {
        await onDeleteSuccess();
      }
    } 
    closeModal();
  };

  return (
    <div className="Confirm-delete-modal">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this {itemType}?</p>
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
