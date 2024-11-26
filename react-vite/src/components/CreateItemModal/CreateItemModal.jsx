import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkAddBoard } from "../../redux/board";
import { thunkAddBoardList } from "../../redux/list";
import "./CreateItemModal.css";

function CreateItemModal({ type, boardId }) {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState("");
  const { closeModal } = useModal();

  useEffect(() => {
    setTitle("");
  }, [closeModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    if (!title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }

    const result = await dispatch(
      type === "board" 
        ? thunkAddBoard(title.trim())
        : thunkAddBoardList(boardId, title.trim())
    );

    if (result.errors) {
      setErrors(result.errors);
    } else {
      closeModal();
    }
  };

  return (
    <div className="create-item-modal">
      <h1>Create New {type === "board" ? "Board" : "List"}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        {errors?.title && <p className="error-text">{errors.title}</p>}
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateItemModal;