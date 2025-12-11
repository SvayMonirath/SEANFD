import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import { Home } from './Components/Home'
import { Graph } from './Components/graph'

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/Graph' element={<Graph/>}/>
      </Routes>
    </Router>
  )
}

export default App
