// Actions
const GET_BOARD_LISTS = "list/getBoardLists";
const ADD_BOARD_LIST = "list/addBoardList";
const GET_LIST = "list/getList";
const UPDATE_LIST = "list/updateList";
const DELETE_LIST = "list/deleteList";

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

// Reducer
const initialState = {
  allLists: [],
  currentList: null,
};

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BOARD_LISTS:
      return {
        ...state,
        allLists: action.payload.lists, // Assuming the payload contains a `lists` array
      };

    case ADD_BOARD_LIST:
      return {
        ...state,
        allLists: [...state.allLists, action.payload],
      };

    case GET_LIST:
      return {
        ...state,
        currentList: action.payload,
      };

    case UPDATE_LIST:
      return {
        ...state,
        allLists: state.allLists.map((list) =>
          list.id === action.payload.id ? action.payload : list
        ),
        currentList:
          state.currentList && state.currentList.id === action.payload.id
            ? action.payload
            : state.currentList,
      };

    case DELETE_LIST:
      return {
        ...state,
        allLists: state.allLists.filter((list) => list.id !== action.payload),
        currentList:
          state.currentList?.id === action.payload ? null : state.currentList,
      };

    default:
      return state;
  }
};

export default listReducer;
