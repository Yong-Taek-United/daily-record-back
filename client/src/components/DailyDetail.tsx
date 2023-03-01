import React, { useEffect, useState } from 'react';
import { Drawer, Box } from '@mui/material';

type Tprops = {
    OpenToggleData: boolean;
    CurrOpenDailyData: {
        id: number;
        createdAt: string;
        events: {
            id: number;
            description: string;
        }[] | null
    } | null;
}

type TDailisInfo = {
    id: number;
    createdAt: string;
    events: {
        id: number;
        description: string;
    }[] | null
}

function DailyDetail(props: Tprops): any {
    const {OpenToggleData, CurrOpenDailyData} = props
    
    const [OpenToggle, setOpenToggle] = useState(false);
    const [CurrOpenDaily, setCurrOpenDaily] = useState<TDailisInfo | null>(null);
    console.log(OpenToggle)
    useEffect(() => {
        setOpenToggle(OpenToggleData);
        setCurrOpenDaily(CurrOpenDailyData);
    }, [])


    const toggleDrawer = (open: boolean, dailiy?: any) => 
        (e: React.KeyboardEvent | React.MouseEvent) => {
            if(e.type === 'keydown' && (
                (e as React.KeyboardEvent).key === 'Tab' ||
                    (e as React.KeyboardEvent).key === 'Shift'
            )) {
            return;
            }
            if(dailiy) {
                setCurrOpenDaily(dailiy);
            }
            setOpenToggle(open);
    };

    return (
        <div>
            하씨발
        <Drawer
            anchor='right'
            open={OpenToggle}
            onClose={toggleDrawer(false, CurrOpenDaily)}
        >
            <Box
                sx={{ width: 400 }}
            >
                {/* <p>{CurrOpenDaily?.id}</p>
                <p>{CurrOpenDaily?.createdAt}</p>
                <div>
                    {CurrOpenDaily?.events?.map((event, i) => {
                        return (<p key={i}>{event.description}</p>)
                    })}
                </div> */}
            </Box>
        </Drawer>
        </div>
    );
};

export default DailyDetail;