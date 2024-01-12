import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import Auth from "./pages/auth/Auth"
import Home from "./pages/home/Home"
import Game from "./pages/game/insfratructure/Game"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>  
          <Route path="/Login" element={<Auth />}></Route>
          <Route path="/Home" element={<Home />}></Route>
          <Route path="/Game" element={<Game />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
