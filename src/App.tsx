import React from 'react'
import './App.scss'
import TrafficLight from './components/TrafficLight.modules'

function App() {
  return (
    <div className="p-1 d-flex flex-wrap">
      {Array.from(Array(20)).map((_, idx) => (
        <TrafficLight key={idx} initialRedDuration={5} initialYellowDuration={3} initialGreenDuration={5} />
      ))}
    </div>
  )
}

export default App
