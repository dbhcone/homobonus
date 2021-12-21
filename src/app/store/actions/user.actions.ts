import { createAction, props } from '@ngrx/store';

const setUserData = createAction(
  'Set [User UserDetails]',
  props<{
    user: {id: string, username: string, email: string, role: string}
  }>()
);

const logoutUser = createAction(
  'Logout [User token]'
);

export { setUserData, logoutUser };
