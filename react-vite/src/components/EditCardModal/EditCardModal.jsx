import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetCardComments, thunkAddComment } from "../../redux/comment";
import { thunkUpdateCard } from "../../redux/card";
import OpenModalButton from "../OpenModalButton";
import ConfirmDeletionModal from "../ConfirmDeletionModal";
import { RiBankCardLine } from "react-icons/ri";
import { ImParagraphCenter } from "react-icons/im";
import { MdOutlineInsertComment } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import "./EditCardModal.css";

const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
};

export default function EditCardModal({ card }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState(card?.title || "");
  const [dueDate, setDueDate] = useState(card?.due_date || "");
  const [description, setDescription] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const cardComments = useSelector((state) => state.comment[card.id]?.slice().sort((a, b) => a.id - b.id));



  useEffect(() => {
    setTitle(card?.title || "");
    setDescription(card?.description || "");
    setDueDate(card?.due_date || "");
  }, [card.title, card.description, card.due_date]);

  useEffect(() => {
    const loadComments = async () => {
      if (card?.id) {
        setIsLoading(true);
        await dispatch(thunkGetCardComments(card.id));
        setIsLoading(false);
      }
    };
    loadComments();
  }, [dispatch, card?.id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!content || !card?.id) return;

    await dispatch(thunkAddComment({ cardId: card.id, content }));
    setContent("");
  };

  const handleDescriptionSave = async () => {
    await dispatch(
      thunkUpdateCard({
        id: card.id,
        description: description,
      })
    );
    setIsEditingDescription(false);
  };
  
  const handleTitleSave = async () => {
    if (title.trim().length >= 25 || title.trim().length === 0) {
      alert("Title must be between 1 and 25 characters");
      return;
    }
    if (title.trim() !== card.title) {
      await dispatch(
        thunkUpdateCard({
          id: card.id,
          title: title.trim(),
        })
      );
    }
    setIsEditingTitle(false);
  };
  
  const handleDueDateSave = async (e) => {
    const newDate = e.target.value;
    setDueDate(newDate);
    await dispatch(
      thunkUpdateCard({
        id: card.id,
        due_date: newDate,
      })
    );
  };

  if (!card) return <div>Card data is unavailable</div>;

  return (
    <div className="edit-card-container">
      <h3>
        <RiBankCardLine />
        {isEditingTitle ? (
          <div className="edit-title-container">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSave();
                if (e.key === "Escape") {
                  setTitle(card.title);
                  setIsEditingTitle(false);
                }
              }}
              className="card-title-input"
              autoFocus
            />
          </div>
        ) : (
          <span onClick={() => setIsEditingTitle(true)} className="card-title">
            {title}
          </span>
        )}
      </h3>

      <div className="card-description">
        <p>
          <ImParagraphCenter /> Description:
        </p>
        {isEditingDescription ? (
          <div className>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              className="card-description-input"
              autoFocus
            />
            <div className="description-buttons">
              <button
                onClick={handleDescriptionSave}
                className="save-description"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingDescription(false);
                  setDescription(card.description || "");
                }}
                className="cancel-description"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              setIsEditingDescription(true);
            }}
            className="description-display"
          >
            {description || "Add a more detailed description..."}
          </div>
        )}
      </div>

      <div className="card-due-date">
        <p>
          <AiOutlineCalendar /> Due Date:
        </p>
        <input
          type="datetime-local"
          value={formatDateForInput(dueDate)}
          onChange={handleDueDateSave}
        />
      </div>

      <div>
        <p>
          <MdOutlineInsertComment /> Comments:
        </p>
      </div>

      <form onSubmit={handleCommentSubmit} className="comment-form">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="comment-input"
        />
        <button type="submit" className="submit-comment-btn">
          Add
        </button>
      </form>

      <div className="card-comments">
        {isLoading ? (
          <div>Loading comments...</div>
        ) : cardComments.length > 0 ? (
          cardComments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span className="comment-date">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
                <OpenModalButton
                  modalComponent={
                    <ConfirmDeletionModal
                      itemId={comment.id}
                      itemType="comment"
                      cardId={card.id}
                    />
                  }
                  buttonText="–"
                />
              </div>
              <div>{comment?.content}</div>
            </div>
          ))
        ) : (
          <div>No comments yet</div>
        )}
      </div>
    </div>
  );
}
