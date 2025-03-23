import { useState } from 'react'
import './App.css'
import PomodoroTimer from './components/pomodoro-timer.jsx';
import CalendarSec from './components/CalendarSec.jsx';
import KanbanSec from './components/KanbanSec.jsx';
import '@progress/kendo-theme-default/dist/all.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main>
        <header>
          <h1>PRODUCTIVITY SUITE</h1>
        </header>
        <nav></nav>
        <div className="container-app">
          <div className="pomodoro">
            <span className='title-section'>Pomodoro</span>
            <div className="timer">
              <PomodoroTimer />
            </div>
          </div>
          <div className="calendar">
            <span className='title-section'>Calendar</span>
            <CalendarSec />
          </div>
          <div className="kanban">
            <span className='title-section'>Kanban</span>
            <KanbanSec />
            <div className="addWork">
              
            </div>
          </div>
        </div>

        <div className="container-app mobile">
          
        </div>
      </main>
    </>
  )
}

export default App
