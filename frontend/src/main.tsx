import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'react-toastify/dist/ReactToastify.min.css';
import { HashRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
  </HashRouter>
)
