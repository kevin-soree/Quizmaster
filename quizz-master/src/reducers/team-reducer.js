import {teamActions} from "../actions/team-actions";

const initialState = {
    teams: [],
    answers: []
};

export function teamReducer(state = initialState, action) {
    switch (action.type) {
        case teamActions.acceptAnswer:
            break;
        case teamActions.declineAnswer:
            break;
        default:
            return state;
    }
}