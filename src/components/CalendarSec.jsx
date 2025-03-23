import { useState } from "react";
import { Calendar } from "@progress/kendo-react-dateinputs";
import './styles/calendar-sec.css'

const CalendarSec = () => {
    return(
        <>
        <div>
            <style>
                {`:root {
                    --kendo-color-primary: #063254;
                    --kendo-color-primary-hover: #063254;
                    --kendo-color-base-hover: #4d82bc;
                    --kendo-color-surface-alt: #3d3d3d;
                    --kendo-color-surface:  #242424;
                    --kendo-color-on-app-surface: #fefefe;
                    --kendo-color-primary-on-surface: #00fff7;
                }`}
            </style>
            <Calendar defaultValue={new Date()} focusedDate={new Date()} defaultActiveView="month"/>
        </div>
        </>
    )
}

export default CalendarSec;