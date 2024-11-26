import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import OpenModalButton from "../OpenModalButton";
import ConfirmDeletionModal from "../ConfirmDeletionModal";
import CardDetails from "../CardDetails";
import { thunkGetBoardLists, thunkUpdateList } from "../../redux/list";
import { thunkGetListCards, thunkAddListCard } from "../../redux/card";
import "./ListDetails.css";

export default function ListDetails({ list, boardId }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list?.title || "");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const cards = useSelector((state) =>
    state.card.allCards.filter((card) => card.list_id === list.id)
  );

  useEffect(() => {
    const fetchCards = async () => {
      await dispatch(thunkGetListCards(list.id));
    };
    fetchCards();
  }, [dispatch, list.id]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleUpdate = async () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle && trimmedTitle !== list.title) {
      const updatedList = { ...list, title: trimmedTitle };
      await dispatch(thunkUpdateList(updatedList));
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTitle(list?.title || "");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTitleUpdate();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleListDelete = async () => {
    await dispatch(thunkGetBoardLists(boardId));
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();

    if (newCardTitle.trim()) {
      dispatch(thunkAddListCard(list.id, newCardTitle.trim()));
      setNewCardTitle("");
    }

    setIsAddingCard(false);
  };

  return (
    <div className="list">
      <div className="list-upper-container">
        <div className="list-header">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleUpdate}
              onKeyDown={handleKeyDown}
              autoFocus
              className="list-title-input"
            />
          ) : (
            <h3 onClick={handleTitleClick} className="list-title">
              {list.title}
            </h3>
          )}
        </div>

        <div className="list-actions">
          <OpenModalButton
            modalComponent={
              <ConfirmDeletionModal
                itemId={list.id}
                itemType="list"
                onDeleteSuccess={handleListDelete}
                boardId={boardId}
              />
            }
            buttonText="–"
            onButtonClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
      {/* Cards Section */}
      <div className="cards-container">
        {cards &&
          cards.map((card) => (
            <CardDetails key={card.id} card={card} listId={list.id} />
          ))}

        {/* Add Card Button */}
        {isAddingCard ? (
          <div className="add-card-form">
            <textarea
              className="card-input"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter a title for this card..."
              autoFocus
            />
            <div className="add-card-controls">
              <button onClick={handleCardSubmit} className="add-card-submit">
                Add card
              </button>
              <button
                onClick={() => setIsAddingCard(false)}
                className="add-card-cancel"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            className="add-card-button"
            onClick={() => setIsAddingCard(true)}
          >
            + Add a card
          </button>
        )}
      </div>
    </div>
  );
}
