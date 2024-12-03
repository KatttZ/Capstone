// Actions
const GET_BOARD_LISTS = "list/getBoardLists";
const ADD_BOARD_LIST = "list/addBoardList";
const GET_LIST = "list/getList";
const UPDATE_LIST = "list/updateList";
const DELETE_LIST = "list/deleteList";
const REORDER_LISTS = "list/reorderLists";

// Action creators

// action for getting all lists of a board
const getBoardLists = (payload) => {
  return {
    type: GET_BOARD_LISTS,
    payload,
  };
};

// action for adding a list to a board
const addBoardList = (payload) => {
  return {
    type: ADD_BOARD_LIST,
    payload,
  };
};

//action for getting a single list
const getList = (payload) => {
  return {
    type: GET_LIST,
    payload,
  };
};

// action for updating a list
const updateList = (payload) => {
  return {
    type: UPDATE_LIST,
    payload,
  };
};

// action for deleting a list
const deleteList = (payload) => {
  return {
    type: DELETE_LIST,
    payload,
  };
};

// action for reordering lists
export const reorderLists = (reorderedLists) => {
  return {
    type: REORDER_LISTS,
    payload: reorderedLists,
  };
};

// Thunk
export const thunkGetBoardLists = (boardId) => async (dispatch) => {
  const res = await fetch(`/api/boards/${boardId}/lists`);

  if (res.ok) {
    const data = await res.json();
    dispatch(getBoardLists(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkAddBoardList = (boardId, title) => async (dispatch) => {
  const res = await fetch(`/api/boards/${boardId}/lists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addBoardList(data));
    dispatch(thunkGetBoardLists(boardId));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkGetList = (listId) => async (dispatch) => {
  const res = await fetch(`/api/lists/${listId}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(getList(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkUpdateList = (list) => async (dispatch) => {
  const res = await fetch(`/api/lists/${list.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(list),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(updateList(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkDeleteList = (listId) => async (dispatch) => {
  const res = await fetch(`/api/lists/${listId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteList(listId));
    return null;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkReorderLists = (boardId, reorderedLists) => async (dispatch) => {
  try {
    // Make an API call to update the order in the backend
    const res = await fetch(`/api/boards/${boardId}/lists/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reorderedLists }),
    });

    if (res.ok) {
      const data = await res.json();
      // Dispatch the action to update the state
      dispatch(reorderLists(data.lists));
      return data;
    } else {
      const errors = await res.json();
      return errors;
    }
  } catch (err) {
    console.error("Error reordering lists:", err);
    return { errors: "An error occurred while reordering lists." };
  }
};



// Reducer
const initialState = {
  allLists: [],
};

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOARD_LISTS:
      return {
        ...state,
        allLists: action.payload.lists, 
      };

    case ADD_BOARD_LIST:
      return {
        ...state,
        allLists: [...state.allLists, action.payload],
      };

    case UPDATE_LIST:
      return {
        ...state,
        allLists: state.allLists.map((list) =>
          list.id === action.payload.id ? action.payload : list
        ),
      };

    case DELETE_LIST:
      return {
        ...state,
        allLists: state.allLists.filter((list) => list.id !== action.payload),
      };
    
    case REORDER_LISTS:
      return {
        ...state,
        allLists: action.payload,
      };

    default:
      return state;
  }
};



export default listReducer;
