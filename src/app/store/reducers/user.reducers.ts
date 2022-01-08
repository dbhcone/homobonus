import { Action, createReducer, on, State } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { logoutUser, setUserData, setUserProfile } from '../actions/user.actions';

const auth = new AuthService();
const { username, email, role, id } = auth.session();
const init = { username, email, role, id };
const initialState = { user: init };

const reducer = createReducer(
    initialState,
    on(setUserData, (state, action) => {
        console.log('state', state);
        console.log('action', action);
        return { ...state, user: action.user };
    }),
    on(logoutUser, (state, action) => {
        auth.unsetToken();
        return { ...state, user: { id: null, username: null, email: null, role: null } };
    })
);

export function userReducer(
    state: { user: { username: string; email: string; role: string; id: string } } | undefined,
    action: Action
) {
    return reducer(state, action);
}

const profileReducer = createReducer(
    { accountOwner: null },
    on(setUserProfile, (state, action) => {
        console.log('state', state);
        console.log('action', action);
        return { ...state, accountOwner: action.accountOwner };
    })
);

export function userProfileReducer(state: { accountOwner: any } | undefined, action: Action) {
    return profileReducer(state, action);
}
