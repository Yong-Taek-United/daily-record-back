import { OpenDailyToggle } from './actions/dailyAction';

export type isOpened = boolean;

export type dailyData = {
    id: number;
    date: string;
    events: {
        id: number;
        description: string;
    }[] | null
} | null;

export type OPENORCLOSEVALUE = {
    openCloseValue: boolean;
    CurDailyData: dailyData;
}

export type changeDailyToggleAction = {
    openCloseValue: ReturnType<typeof OpenDailyToggle>
}