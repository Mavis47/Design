import { Route, Routes } from 'react-router-dom'
import './App.css'
import Main from './components/layout/main';
import Directory from './components/Directory';


function App() {

  return (
    <>
     <Routes>
      <Route path="/" element={<Main/>}/>
      <Route path="/directory" element={<Directory/>}/>
     </Routes>
    </>
  )
}

export default App
