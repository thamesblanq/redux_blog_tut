import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import { store } from './app/store';
import { fetchUsers } from './features/users/usersSlice';
import { extendedApiSlice } from './features/posts/postsSlice';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

store.dispatch(fetchUsers());
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Provider store={store}>
        <Router>
            <Routes>
                <Route path="/*" element={<App/>} />
            </Routes>
        </Router>
      </Provider> 
  </React.StrictMode>,
)
