import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChartComponent from './ChartComponent'

function App() {
  return (
    <div>
      <h2> Spike Data Capture Demo</h2>
      <br/>
      <ChartComponent />
    </div>
  );
}

export default App
