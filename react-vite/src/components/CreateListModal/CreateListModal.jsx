import { useState, useEffect } from "react";
import { useDispatch} from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkAddBoardList } from "../../redux/list";
import "./CreateListModal.css";


function CreateListModal({ boardId }) {
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
  
      const result = await dispatch(thunkAddBoardList(boardId, title.trim()));
      if (result.errors) {
        setErrors(result.errors);
      } else {
        closeModal();
      }
    };
  
    return (
      <div className="create-board-modal">
        <h1>Create New List</h1>
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
  
  export default CreateListModal;
  