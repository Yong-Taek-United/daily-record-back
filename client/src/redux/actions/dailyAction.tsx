import * as type from '../types';

export const CHANGE_DAILYTOGGLE = 'changeDailyToggle/CHANGE_DAILYTOGGLE' as const;

export const OpenDailyToggle = (isOpened: type.isOpened ) => ({
    type: CHANGE_DAILYTOGGLE,
    payload: isOpened,
});