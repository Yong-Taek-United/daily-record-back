import * as type from '../types';

export const OPEN_DAILYTOGGLE = 'openDailyToggle/OPEN_DAILYTOGGLE' as const;
export const OpenDailyToggle = (isOpened: type.isOpened) => ({
    type: OPEN_DAILYTOGGLE,
    payload: isOpened,
});

export const SET_TARGETELEMENT = 'setTargetElement/SET_TARGETELEMENT' as const;
export const setTargetElement = (targetElement: type.targetElement) => ({
    type: SET_TARGETELEMENT,
    payload: targetElement,
});

export const SET_YEARMONTH = 'setYearMonth/SET_YEARMONTH' as const;
export const setYearMonth = (yearMonth: type.yearMonth) => ({
    type: SET_YEARMONTH,
    payload: yearMonth,
});

export const SET_DAILYDATE = 'setDailyDate/SET_DAILYDATE' as const;
export const setDailyDate = (dailyDate: type.dailyDate) => ({
    type: SET_DAILYDATE,
    payload: dailyDate,
});

export const SET_DAILYID = 'setDailyId/SET_DAILYID' as const;
export const setDailyId = (dailyId: type.dailyId) => ({
    type: SET_DAILYID,
    payload: dailyId,
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