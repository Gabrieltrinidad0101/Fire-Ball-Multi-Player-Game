import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Loading from './components/loading/Loading.tsx'
import { ToastContainer } from 'react-toastify'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Loading/>
    <ToastContainer />
  </React.StrictMode>,
)
