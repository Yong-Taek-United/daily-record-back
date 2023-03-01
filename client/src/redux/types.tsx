import { OpenDailyToggle } from './actions/dailyAction';

export type isOpened = boolean;

export type OPENORCLOSEVALUE = {
    openCloseValue: boolean;
}

export type changeDailyToggleAction = ReturnType<typeof OpenDailyToggle>;