//React 
import { useState, useRef, useEffect, useCallback } from "react";

//Kendo components
import { Popover, PopoverActionsBar } from '@progress/kendo-react-tooltip';
import { Button, ButtonGroup } from '@progress/kendo-react-buttons';
import { Card, CardBody, CardHeader, CardTitle } from "@progress/kendo-react-layout";
import { Slider, SliderLabel, NumericTextBox } from "@progress/kendo-react-inputs";
import { ProgressBar } from "@progress/kendo-react-progressbars";

//Iconos - Estilos
import { FaGear } from "react-icons/fa6";
import './styles/pomodoro-timer.css';

function PomodoroTimer() {
    const [timeWork, setTimeWork] = useState(25);
    const [timeShortBreak, setTimeShortBreak] = useState(5);
    const [timeLongBreak, setTimeLongBreak] = useState(10);
    

    const [ratio, setRatio] = useState(1);
    const [workPeriods, setWorkPeriods] = useState(1);

    const [stateTimer, setStateTimer] = useState('desactive');
    //const [stateWork, setStateWork] = useState({work: true, shortBreak: false, longBreak: false,});
    const [[seconds, min, state, valueBar, maxValueBar], setTime] = useState([0, timeWork, {work: true, shortBreak: false, longBreak: false,}, 0, timeWork*60]);
    //const [valueBar, setValueBar] = useState(0);
    const intervalRef = useRef(null);
    let countPeriods = useRef(0);

    const handeleClickStart = () => {
        setStateTimer('active')
        intervalRef.current = setInterval(() => {
            setTime((prevTime)=> {
                if(prevTime[0] == 0){
                    if(prevTime[1] <= 0){
                        console.log(prevTime[2]);
                        if(prevTime[2].work){
                            countPeriods.current++;
                            console.log(countPeriods.current);
                            console.log(countPeriods.current === ratio*2)
                            if(countPeriods.current === ratio*2){
                                countPeriods.current = 0;
                                return [0, timeLongBreak, {work: false, shortBreak: false, longBreak: true,}, 0, timeLongBreak*60];
                            }
                            return [0, timeShortBreak, {work: false, shortBreak: true, longBreak: false,}, 0, timeShortBreak*60];
                        }  
                        if((prevTime[2].longBreak || prevTime[2].shortBreak)) {
                            return [0, timeWork, {work: true, shortBreak: false, longBreak: false,}, 0, timeWork*60];
                        } 
                    }
                    return [59, prevTime[1]-1, prevTime[2], prevTime[3]+1, prevTime[4]];
                }  
                return [prevTime[0]-1, prevTime[1], prevTime[2], prevTime[3]+1, prevTime[4]]; 
            });
        }, 1000);
    }

    const handeleClickPause = () => {
        clearInterval(intervalRef.current);
        setStateTimer('desactive')
    }

    //Button Config
    const anchor = useRef(null);
    const [show, setShow] = useState(false);
    
    const handleClickConfig = () => {
        setShow(!show)
    }

    const handleClickSave = (e) => {
        setTime([0,timeWork, {work: true, shortBreak: false, longBreak: false,}, 0, timeWork*60]);
        setShow(false);
    }

    const handeleClickCancel = () => {
        setShow(false);
    }

    const CreateSteps = (steps) => {
        const markSteps = [];
        for(let i = 0; i < steps; i++){
            markSteps.push(
                <SliderLabel position={i+1}>
                    {i+1}
                </SliderLabel>
            )
        }
        return markSteps;
    }

    let newMinWork = 0;
    let newMinShortBreak = 0;
    let newMinLongBreak = 0;
    let newWorkPeriods = 0;
    let newRatio = 0;

    const getMinWork = e => {
        newMinWork = e.value;
        setTimeWork(newMinWork);
    }
    const getMinShortBreak = e => {
        newMinShortBreak = e.value;
        setTimeShortBreak(newMinShortBreak);
    }
    const getMinLongBreak = e => {
        newMinLongBreak = e.value;
        setTimeLongBreak(newMinLongBreak)
    }
    const getWorkPeriods = e => {
        newWorkPeriods = e.value;
        setWorkPeriods(newWorkPeriods);
        
    }
    const getRatio = e => {
        newRatio = e.value;
        setRatio(newRatio);
    }

    return(
        <>
            <div className="container-pomodoro">
                <ButtonGroup className="b-container">
                    <Button className={`b b-w ${(state.work)? "active" : ""}`}><span>Work</span></Button> 
                    <Button className={`b b-sb ${(state.shortBreak)? "active" : ""}`}><span>Short Break</span></Button> 
                    <Button className={`b b-lb ${(state.longBreak)? "active" : ""}`}><span>Long Break</span></Button>
                </ButtonGroup>
                <div className="container-pomodoro-timer">
                    <div className="time">
                        <p>{(min>=10) ? min :`0${min}`}</p>
                        <p>:</p>
                        <p>{(seconds>=10) ? seconds : `0${seconds}`}</p>
                        
                    </div>  

                </div>
                <ProgressBar value={(valueBar*100)/maxValueBar} labelVisible={false}/>
                <ButtonGroup className="b-container-state">
                    <Button className={`b-s ${stateTimer}`} onClick={handeleClickStart} disabled={stateTimer=='active'? true : false}><span>Start</span></Button> 
                    <Button className={`b-p ${stateTimer}`} onClick={handeleClickPause} disabled={stateTimer=='desactive'? true : false}><span>Pause</span></Button> 
                </ButtonGroup>
                <div>
                    <Button className={`b-config ${show ? 'active-config' : ''}`} disabled={
                        (show || stateTimer=='active') ? true : false} type="button" onClick={handleClickConfig} ref={anchor}>
                        <FaGear />
                    </Button>
                    <Popover 
                        position="bottom"
                        show={show} 
                        anchor={anchor.current && anchor.current.element}
                        pupupClass={'popup-content'}>
                        <Card orientation="vertical">
                            <CardHeader>
                                <CardTitle>Config timer</CardTitle>
                            </CardHeader>
                            <CardBody className="inputs-config">
                                <div>Minutes Work: {}</div>
                                <NumericTextBox defaultValue={timeWork} step={5} spinners={true} min={25} max={120} onChange={getMinWork}></NumericTextBox>
                                <div>Minutes Short Break: {}</div>
                                <NumericTextBox defaultValue={timeShortBreak} step={5} spinners={true} min={5} max={20} onChange={getMinShortBreak}></NumericTextBox>
                                <div>Minutes Long Break: {}</div>
                                <NumericTextBox defaultValue={timeLongBreak} step={5} spinners={true} min={10} max={30} onChange={getMinLongBreak}></NumericTextBox>
                                <div>Work Periods:</div>
                                <Slider step={1} defaultValue={workPeriods} min={1} max={10} buttons={true} onChange={getWorkPeriods} className="slider-work-periods">
                                    {CreateSteps(10)}
                                </Slider>
                                <div>Ratio Short/Long:</div>
                                <Slider step={1} defaultValue={ratio} min={1} max={4} buttons={true} onChange={getRatio}>
                                    {CreateSteps(4)}
                                </Slider>
                                
                            </CardBody>
                        </Card>    
                        <PopoverActionsBar>
                            <Button className="b-save" onClick={handleClickSave}>
                                Save
                            </Button>
                            <Button className="b-cancel" onClick={handeleClickCancel}>
                                Cancel
                            </Button>
                        </PopoverActionsBar>
                    </Popover>
                    
                </div>
            </div>
        </>
    )
}

export default PomodoroTimer;

