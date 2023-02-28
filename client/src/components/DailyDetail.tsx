import React, { ForwardedRef } from 'react'

type props = {
    detailRef: ForwardedRef<HTMLDivElement>;
}

function DailyDetail(props: props) {
    const {detailRef} = props

    return (
        <div style={{backgroundColor: 'gray'}} ref={detailRef}>DailyDetail</div>
    )
}

export default DailyDetail