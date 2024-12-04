// Actions
const GET_LIST_CARDS = "card/getListCards";
const ADD_LIST_CARD = "card/addListCard";
const GET_CARD = "card/getCard";
const UPDATE_CARD = "card/updateCard";
const DELETE_CARD = "card/deleteCard";
const MOVE_CARD = "card/moveCard";

// Action Creators
const getListCards = (payload) => {
  return {
    type: GET_LIST_CARDS,
    payload,
  };
};

const addListCard = (payload) => {
  return {
    type: ADD_LIST_CARD,
    payload,
  };
};

const getCard = (payload) => {
  return {
    type: GET_CARD,
    payload,
  };
};

const updateCard = (payload) => {
  return {
    type: UPDATE_CARD,
    payload,
  };
};

const deleteCard = (payload) => {
  return {
    type: DELETE_CARD,
    payload,
  };
};

const moveCard = (cardId, sourceListId, destListId, destIndex) => {
  return {
    type: MOVE_CARD,
    payload: { cardId, sourceListId, destListId, destIndex },
  };
};

// Thunk
export const thunkGetListCards = (listId) => async (dispatch) => {
  const res = await fetch(`/api/lists/${listId}/cards`);

  if (res.ok) {
    const data = await res.json();
    dispatch(
      getListCards({
        list_id: listId,
        cards: data.cards,
      })
    );
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkAddListCard = (listId, title) => async (dispatch) => {
  const res = await fetch(`/api/lists/${listId}/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addListCard(data));
    dispatch(thunkGetListCards(listId));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkGetCard = (cardId) => async (dispatch) => {
  const res = await fetch(`/api/cards/${cardId}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(getCard(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkUpdateCard = (card) => async (dispatch) => {
  const res = await fetch(`/api/cards/${card.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(card),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(updateCard(data));
    return data;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkDeleteCard = (cardId) => async (dispatch) => {
  const res = await fetch(`/api/cards/${cardId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteCard(cardId));
    return null;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkMoveCard =
  (cardId, destListId, destIndex) => async (dispatch, getState) => {
    const currentState = getState();
    const card = currentState.card.allCards.find((c) => c.id === cardId);
    const sourceListId = card.list_id;

    // Optimistic update
    dispatch(moveCard(cardId, sourceListId, destListId, destIndex));

    try {
      const res = await fetch(`/api/cards/${cardId}/move`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destListId,
          destIndex,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      return data;
    } catch (error) {
      dispatch(thunkGetListCards(sourceListId));
      if (sourceListId !== destListId) {
        dispatch(thunkGetListCards(destListId));
      }
      throw error;
    }
  };

// Reducer
const initialState = {
  allCards: [],
};

const cardReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LIST_CARDS:
      return {
        ...state,
        allCards: [
          ...state.allCards.filter(
            (card) => card.list_id !== action.payload.list_id
          ),
          ...action.payload.cards,
        ],
      };
    case ADD_LIST_CARD:
      return {
        ...state,
        allCards: [...state.allCards, action.payload],
      };
    case GET_CARD:
      return {
        ...state,
        allCards: [...state.allCards, action.payload],
      };
    case UPDATE_CARD:
      return {
        ...state,
        allCards: state.allCards.map((card) =>
          card.id === action.payload.id ? action.payload : card
        ),
      };
    case DELETE_CARD:
      return {
        ...state,
        allCards: state.allCards.filter((card) => card.id !== action.payload),
      };
    case MOVE_CARD: {
      const { cardId, destListId, destIndex } = action.payload;

      // Get all cards excluding the moved one
      const cardToMove = state.allCards.find((card) => card.id === cardId);
      const otherCards = state.allCards.filter((card) => card.id !== cardId);

      // Get destination list cards
      const destListCards = otherCards.filter(
        (card) => card.list_id === destListId
      );

      // Insert card at new position
      destListCards.splice(destIndex, 0, {
        ...cardToMove,
        list_id: destListId,
      });

      // Combine cards from all lists
      const newCards = [
        ...otherCards.filter((card) => card.list_id !== destListId),
        ...destListCards,
      ];

      return {
        ...state,
        allCards: newCards,
      };
    }
    default:
      return state;
  }
};

export default cardReducer;
