import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { thunkGetAllBoards } from "../../redux/board";
import { thunkGetBoardLists } from "../../redux/list";
import OpenModalButton from "../OpenModalButton";
import CreateListModal from "../CreateListModal";
import ListDetails from "../ListDetails";
import "./BoardDetails.css";


export default function BoardDetails({ boardId }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const board = useSelector((state) => 
    state.board.allBoards.find((board) => board.id === boardId)
  );
  const lists = useSelector((state) => 
    state.list.allLists.filter((list) => list.board_id === boardId)
  );


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(thunkGetAllBoards());
      await dispatch(thunkGetBoardLists(boardId));
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, boardId]);

  if (isLoading) {
    return <div className="board-details">Loading...</div>;
  }

  if (!board) {
    return (
      <div className="board-details">
        <h2>Board not found</h2>
      </div>
    );
  }

  return (
    <div className="board-details">
      <div className="board-header">
        <h2>{board.title}</h2>
      </div>
      <div className="lists-container">
        {lists && lists.length > 0 ? (
          lists.map((list) => (
            <ListDetails 
            key={list.id} 
            list={list}
          />
          ))
        ) : (
          <p>No lists found. Create a new list to get started!</p>
        )}
         <OpenModalButton
          modalComponent={<CreateListModal boardId={board.id}/>}
          buttonText="+ Add another list"
        />
      </div>
    </div>
  );
}