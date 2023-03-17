import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter as Router} from 'react-router-dom'
import { AuthUserProvider } from './firebase/auth'
import { SpacesProvider } from './firebase/space'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // firebase-ui-react need comment the strictMode
  // <React.StrictMode>
    <SpacesProvider>
      <AuthUserProvider>
        <Router>
          <App />
        </Router>
      </AuthUserProvider>
    </SpacesProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();