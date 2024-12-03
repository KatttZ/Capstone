// Actions
const GET_LIST_CARDS = "card/getListCards";
const ADD_LIST_CARD = "card/addListCard";
const GET_CARD = "card/getCard";
const UPDATE_CARD = "card/updateCard";
const DELETE_CARD = "card/deleteCard";


// Action Creators
const getListCards = (payload) => {
    return {
        type: GET_LIST_CARDS,
        payload,
    }
}

const addListCard = (payload) => { 
    return {
        type: ADD_LIST_CARD,
        payload,
    }
}

const getCard = (payload) => {
    return {
        type: GET_CARD,
        payload,
    }
}

const updateCard = (payload) => {
    return {
        type: UPDATE_CARD,
        payload,
    }
}

const deleteCard = (payload) => {
    return {
        type: DELETE_CARD,
        payload,
    }
}

// Thunk
export const thunkGetListCards = (listId) => async (dispatch) => {
    const res = await fetch(`/api/lists/${listId}/cards`);

    if (res.ok) {
        const data = await res.json();
        dispatch(getListCards({
            list_id: listId,
            cards: data.cards
        }));
        return data;
    } else {
        const errors = await res.json();
        return errors;
    }
}


export const thunkAddListCard = (listId, title) => async (dispatch) => {
    const res = await fetch(`/api/lists/${listId}/cards`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({title}),
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
}

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
}

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
}

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
}

export const thunkUpdateCardOrder = (listId, cardOrder) => async (dispatch) => {
    try {
      const res = await fetch(`/api/lists/${listId}/cards/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardOrder }),
      });

      if (res.ok) {
        dispatch(thunkGetListCards(listId));
      }
    } catch (error) {
      console.error("Failed to reorder cards:", error);
    }
  };
  


// Reducer
const initialState = {
    allCards: []
};

const cardReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_LIST_CARDS:
            return {
                ...state,
                allCards: [
                    ...state.allCards.filter(card => card.list_id !== action.payload.list_id),
                    ...action.payload.cards
                ]
            }
        case ADD_LIST_CARD:
            return {
                ...state,
                allCards: [...state.allCards, action.payload]
            }
        case GET_CARD:
            return {
                ...state,
                allCards: [...state.allCards, action.payload]
            }
        case UPDATE_CARD:
            return {
                ...state,
                allCards: state.allCards.map((card) => 
                    card.id === action.payload.id ? action.payload : card
            )
            }
        case DELETE_CARD:
            return {
                ...state,
                allCards: state.allCards.filter((card) => card.id !== action.payload)
            }
        default:
            return state;
    }
}


export default cardReducer;