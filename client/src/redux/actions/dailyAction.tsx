import * as type from '../types';

export const OPEN_DAILYTOGGLE = 'openDailyToggle/OPEN_DAILYTOGGLE' as const;
export const OpenDailyToggle = (isOpened: type.isOpened) => ({
    type: OPEN_DAILYTOGGLE,
    payload: isOpened,
});

export const SET_DAILYDATE = 'setDailyDate/SET_DAILYDATE' as const;
export const setDailyDate = (dailyDate: type.dailyDate) => ({
    type: SET_DAILYDATE,
    payload: dailyDate,
});

export const SET_DAILYDATA = 'setDailyData/SET_DAILYDATA' as const;
export const setDailyData = (dailyData: type.dailyData) => ({
    type: SET_DAILYDATA,
    payload: dailyData,
});

export const SET_DAILIESDATA = 'setDailiesData/SET_DAILIESDATA' as const;
export const setDailiesData = (dailiesData: type.dailyData[]) => ({
    type: SET_DAILIESDATA,
    payload: dailiesData,
});