// Actions
const GET_ALL_BOARDS = "board/getAllBoards";
const GET_BOARD = "board/getBoard";
const ADD_BOARD = "board/addBoard";
const UPDATE_BOARD = "board/updateBoard";
const DELETE_BOARD = "board/deleteBoard";

// Action Creators

// action for getting all boards
const getAllBoards = (payload) => {
  return {
    type: GET_ALL_BOARDS,
    payload,
  };
};

// action for getting a single board
const getBoard = (payload) => {
  return {
    type: GET_BOARD,
    payload,
  };
};

// action for creating a board
const addBoard = (payload) => {
  return {
    type: ADD_BOARD,
    payload,
  };
};

// action for updating a board
const updateBoard = (payload) => {
  return {
    type: UPDATE_BOARD,
    payload,
  };
};

// action for deleting a board
const deleteBoard = (payload) => {
  return {
    type: DELETE_BOARD,
    payload,
  };
};

// Thunks
export const thunkGetAllBoards = () => async (dispatch) => {
  const res = await fetch("/api/boards/");

  if (res.ok) {
    const data = await res.json();
    dispatch(getAllBoards(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkGetBoard = (boardId) => async (dispatch) => {
  const res = await fetch(`/api/boards/${boardId}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(getBoard(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkAddBoard = (title) => async (dispatch) => {
  const res = await fetch("/api/boards/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({title}),
  });
 
  if (res.ok) {
    const data = await res.json();
    dispatch(addBoard(data));
    dispatch(thunkGetAllBoards());
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkUpdateBoard = (boardId, title) => async (dispatch) => {
  const res = await fetch(`/api/boards/${boardId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(updateBoard(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkDeleteBoard = (boardId) => async (dispatch) => {
  const res = await fetch(`/api/boards/${boardId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(deleteBoard(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

// Reducer
const initialState = {
  allBoards: [],
  singleBoard: null,
  count: 0,
};

const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_BOARDS:
      return {
        ...state,
        allBoards: action.payload.boards,
        count: action.payload.count,
      };

    case GET_BOARD:
      return {
        ...state,
        singleBoard: action.payload,
      };

    case ADD_BOARD:
      return {
        ...state,
        allBoards: [...state.allBoards, action.payload],
        count: state.count + 1,
      };

    case UPDATE_BOARD:
      return {
        ...state,
        allBoards: state.allBoards.map((board) =>
          board.id === action.payload.id ? action.payload : board
        ),
        singleBoard: action.payload,
      };

    case DELETE_BOARD:
      return {
        ...state,
        allBoards: state.allBoards.filter(
          (board) => board.id !== action.payload
        ),
        count: state.count - 1,
        singleBoard: null,
      };

    default:
      return state;
  }
};

export default boardReducer;
