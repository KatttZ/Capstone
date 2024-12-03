import { DragDropContext, Droppable, Draggable } from "../../../node_modules/@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import OpenModalButton from "../OpenModalButton";
import ConfirmDeletionModal from "../ConfirmDeletionModal";
import CardDetails from "../CardDetails";
import { thunkGetBoardLists, thunkUpdateList } from "../../redux/list";
import { thunkGetListCards, thunkAddListCard, thunkUpdateCardOrder } from "../../redux/card";
import "./ListDetails.css";

export default function ListDetails({ list, boardId, dragHandleProps }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list?.title || "");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [errors, setErrors] = useState("");

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
    
    const trimmedTitle = newCardTitle.trim();
    if (!trimmedTitle) {
      setErrors({ card: "Card title cannot be empty." });
      return;
    }
    
    if (trimmedTitle.length > 25) {
      setErrors({ card: "Card title should be 25 characters or less." });
      return;
    }
    
    dispatch(thunkAddListCard(list.id, trimmedTitle));
    setNewCardTitle("");
    setErrors(""); 
    setIsAddingCard(false);
  };
  
  const handleCardDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const updatedCards = Array.from(cards);
    const [movedCard] = updatedCards.splice(source.index, 1);
    updatedCards.splice(destination.index, 0, movedCard);

    // Pass just the card IDs in order
    const cardOrder = updatedCards.map(card => card.id);
    
    dispatch(thunkUpdateCardOrder(list.id, cardOrder));
  };
  


  return (
    <div className="list">
      <div className="list-upper-container"  
        {...dragHandleProps}>
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
          />
        </div>
      </div>
      {/* Cards Section */}

      <DragDropContext onDragEnd={handleCardDragEnd}>
      <Droppable droppableId={list.id.toString()} type="CARD">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="cards-container"
          >
            {cards.map((card, index) => (
              <Draggable
                key={card.id}
                draggableId={card.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <CardDetails card={card} listId={list.id} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="add-card-section">
        {isAddingCard ? (
          <div className="add-card-form">
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter a title for this card..."
              className="card-input"
              autoFocus
            />
            {errors?.card && <p className="error-text">{errors.card}</p>}
            <div className="add-card-controls">
              <button onClick={handleCardSubmit} className="add-card-submit">
                Add card
              </button>
              <button
                onClick={() => {
                  setIsAddingCard(false);
                  setErrors("");
                  setNewCardTitle("");
                }}
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
      </DragDropContext>
    </div>
  );
}
