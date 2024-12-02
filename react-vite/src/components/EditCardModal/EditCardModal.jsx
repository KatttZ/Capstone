import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetCardComments, thunkAddComment } from "../../redux/comment";
import OpenModalButton from "../OpenModalButton";
import ConfirmDeletionModal from "../ConfirmDeletionModal";
import "./EditCardModal.css";

export default function EditCardModal({ card }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState("");

  const cardComments = useSelector((state) => state.comment[card.id]);

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

  if (!card) return <div>Card data is unavailable</div>;

  return (
    <div className="edit-card-container">
      <h3>{card.title}</h3>
      <div className="card-description">
        <p>Description</p>
        <div>{card.description}</div>
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
              <div className="comment-content">{comment?.content}</div>
            </div>
          ))
        ) : (
          <div className="no-comments">No comments yet</div>
        )}
      </div>
    </div>
  );
}
