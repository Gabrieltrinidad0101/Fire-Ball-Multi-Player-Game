import Auth from "./pages/auth/insfranstructure/Auth"
import Home from "./pages/home/insfranstructure/Home.tsx"
import Game from "./pages/game/insfratructure/Game"
import { ToastContainer } from "react-toastify"
import Loading from './components/loading/Loading.tsx'
import { AuthenticationProvider } from "./share/insfranstructure/AuthenticationContext.tsx"
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
        <Routes>  
          <Route path="/" element={<Auth auth={false} />}></Route>
          <Route path="/register" element={<Auth auth={false}/>}></Route>
          <Route path="/login" element={<Auth auth={true} />}></Route>
          <Route element={<AuthenticationProvider/>} >
            <Route path="/home" element={<Home />}></Route>
            <Route path="/game/:gameId" element={<Game />}></Route>
          </Route>
        </Routes>
        <ToastContainer />
        <Loading/>
    </>
  )
}

export default App
