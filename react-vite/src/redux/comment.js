// Actions
const GET_CARD_COMMENTS = "comment/getCardComments";
const ADD_COMMENT = "comment/addComment";
const GET_COMMENT = "comment/getComment";
const UPDATE_COMMENT = "comment/updateComment";
const DELETE_COMMENT = "comment/deleteComment";


// Action Creators
const getCardComments = (payload) => {
    return {
        type: GET_CARD_COMMENTS,
        payload,
    }
}

const addComment = (payload) => {
    return {
        type: ADD_COMMENT,
        payload,
    }
}

const getComment = (payload) => {
    return {
        type: GET_COMMENT,
        payload,
    }
}

const updateComment = (payload) => {    
    return {
        type: UPDATE_COMMENT,
        payload,
    }
}

const deleteComment = (payload) => {
    return {
        type: DELETE_COMMENT,
        payload,
    }
}


// Thunk
export const thunkGetCardComments = (cardId) => async (dispatch) => {
    const res = await fetch(`/api/cards/${cardId}/comments`);

    if (res.ok) {
        const data = await res.json();
        dispatch(getCardComments({
            card_id: cardId,
            comments: data.comments
        }));
        return data;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const thunkAddComment = ({ cardId, content }) => async (dispatch) => {
    const response = await fetch(`/api/cards/${cardId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });

    if (response.ok) {
        const newComment = await response.json();
        dispatch(addComment({
            card_id: cardId,
            comment: newComment
        }));
        return newComment;
    }
};


export const thunkGetComment = (commentId) => async (dispatch) => {
    const res = await fetch(`/api/comments/${commentId}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(getComment(data));
        return data;
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const thunkUpdateComment = (comment) => async (dispatch) => {    
    const res = await fetch(`/api/comments/${comment.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(updateComment(data));
        return data;
    } else {
        const errors = await res.json();
        return errors;
    }
}


export const thunkDeleteComment = (commentId) => async (dispatch) => {
    const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(deleteComment(data));
        return data;
    } else {
        const errors = await res.json();
        return errors;
    }
}


// Reducer
const initialState = {};


export default function commentReducer(state = initialState, action) {
    switch (action.type) {
        case GET_CARD_COMMENTS:
            return {
                ...state,
                [action.payload.card_id]: action.payload.comments
            };
        case ADD_COMMENT:
            return {
                ...state,
                [action.payload.card_id]: [
                    ...(state[action.payload.card_id] || []),
                    action.payload.comment
                ]
            };
        case DELETE_COMMENT:
            return {
                ...state,
                [action.payload.card_id]: state[action.payload.card_id]?.filter(
                    (comment) => comment.id !== action.payload.comment_id
                ),
            };
        default:
            return state;
    }
}
