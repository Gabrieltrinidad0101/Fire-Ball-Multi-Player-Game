import { BrowserRouter, Route, Routes } from "react-router-dom"
import Auth from "./pages/auth/insfranstructure/Auth"
import Home from "./pages/home/insfranstructure/Home.tsx"
import Game from "./pages/game/insfratructure/Game"
import { ToastContainer } from "react-toastify"
import Loading from './components/loading/Loading.tsx'
import { AuthenticationProvider } from "./share/insfranstructure/AuthenticationContext.tsx"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>  
          <Route path="/Login" element={<Auth auth={true} />}></Route>
          <Route path="/Register" element={<Auth auth={false}/>}></Route>
          <Route element={<AuthenticationProvider/>} >
            <Route path="/Home" element={<Home />}></Route>
            <Route path="/Game/:gameId" element={<Game />}></Route>
          </Route>
        </Routes>
        <ToastContainer />
        <Loading/>
      </BrowserRouter>
    </>
  )
}

export default App
