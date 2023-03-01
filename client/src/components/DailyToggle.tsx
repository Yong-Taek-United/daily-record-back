import React from 'react';
import { Box, Drawer } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers/rootReducer';
import * as type from '../redux/types'

type Tprops = {
    setOpenToggle(isOpened: boolean): type.changeDailyToggleAction['openCloseValue'];
}

function DailyToggle(props: Tprops) {
    const { setOpenToggle } = props;

    const {openCloseValue, CurDailyData} = useSelector((state: RootState) => state.dailyReducer);

    const toggleDrawer = (open: boolean) => 
        (e: React.KeyboardEvent | React.MouseEvent) => {
            if(e.type === 'keydown' && (
                (e as React.KeyboardEvent).key === 'Tab' ||
                    (e as React.KeyboardEvent).key === 'Shift'
            )) {
            return;
            }
            setOpenToggle(open);
    };
    
    return (
        <Drawer
            anchor='right'
            open={openCloseValue}
            onClose={toggleDrawer(false)}
        >
            <Box
                sx={{ width: 400 }}
            >
                <p>{CurDailyData?.id}</p>
                <p>{CurDailyData?.createdAt}</p>
                <div>
                    {CurDailyData?.events?.map((event, i) => {
                        return (<p key={i}>{event.description}</p>)
                    })}
                </div>
            </Box>
        </Drawer>
    );
};

export default DailyToggle;