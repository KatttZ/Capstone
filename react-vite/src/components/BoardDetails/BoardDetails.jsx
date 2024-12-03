import { DragDropContext, Droppable, Draggable } from "../../../node_modules/@hello-pangea/dnd";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { thunkGetAllBoards, thunkUpdateBoard } from "../../redux/board";
import { thunkGetBoardLists, thunkReorderLists, reorderLists} from "../../redux/list";
import OpenModalButton from "../OpenModalButton";
import CreateItemModal from "../CreateItemModal";
import ListDetails from "../ListDetails";
import "./BoardDetails.css";

export default function BoardDetails({ boardId }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");


  const board = useSelector((state) =>
    state.board.allBoards.find((board) => board.id === boardId)
  );
  const lists = useSelector((state) =>
    state.list.allLists.filter((list) => list.board_id === boardId)
  );

  useEffect(() => {
    const fetchBoardData = async () => {
      setIsLoading(true);
      await dispatch(thunkGetAllBoards()),
      await dispatch(thunkGetBoardLists(boardId)),
      setIsLoading(false);
    };

    fetchBoardData();
  }, [dispatch, boardId]);



  const handleTitleClick = () => {
    setIsEditing(true);
    setTitle(board?.title || "");
  };

  const handleTitleUpdate = async () => {
    if (title.trim() && title !== board?.title) {
      await dispatch(thunkUpdateBoard(boardId, title.trim()));
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTitleUpdate();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTitle(board?.title || "");
    }
  };


const handleDragEnd = async (result) => {
  const { destination, source} = result;
  
  if (!destination || destination.index === source.index ) return;
  
  const updatedLists = Array.from(lists);
  const [movedList] = updatedLists.splice(source.index, 1);
  updatedLists.splice(destination.index, 0, movedList);
  
  dispatch(reorderLists(updatedLists));

  try {
    await dispatch(thunkReorderLists(boardId, updatedLists.map(list => list.id)));
  } catch (error) {
    dispatch(reorderLists(lists));
  }
};
  

  if (isLoading) return <div className="board-details">Loading...</div>;

  if (!board) {
    return (
      <div className="board-details">
        <h2>Board not found</h2>
      </div>
    );
  }

  return (
    <div className="board-details">
      {/* Board Header */}
      <div className="board-header">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleUpdate}
            onKeyDown={handleKeyDown}
            autoFocus
            className="board-title-input"
          />
        ) : (
          <h2 onClick={handleTitleClick} className="board-title">
            {board.title}
          </h2>
        )}
      </div>

      {/* Lists Section */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board-lists" direction="horizontal" type="LIST">
          {(provided) => (
            <div
              className="lists-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {lists.map((list, index) => (
                <Draggable
                  key={list.id}
                  draggableId={list.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <ListDetails key={list.id} list={list} boardId={board.id} dragHandleProps={provided.dragHandleProps}/>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {/* Add New List Section */}
              <div className="add-list-container">
                <OpenModalButton
                  modalComponent={
                    <CreateItemModal type="list" boardId={board.id} />
                  }
                  buttonText="+ Add New List"
                />
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}