import * as type from '../types';

export const SET_USERDATA = 'setUserData/SET_USERDATA' as const;
export const setUserData = (user: type.userData) => ({
    type: SET_USERDATA,
    payload: user,
});
