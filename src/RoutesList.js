import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'

// Components
import Form from "./components/common/Form/Form"
import CreateSpace from "./components/CreateEditSpace/CreateEditSpace"
import Home from "./components/Home/Home"
import NotFound from "./components/NotFound/NotFound"
import Profile from "./components/Profile/Profile"
import Space from "./components/Space/Space"
import User from "./components/User/User"

import { CREATE_LEARNING_SPACE_URL, HOME_URL, LOGIN_URL, PROFILE_URL, REGISTER_URL, SPACES_URL, USERS_URL } from "./constants"

import useAuth from './firebase/auth'

const RequireAuth = ({ children }) => {
  const {authUser} = useAuth();
  const  location = useLocation();

  if (!authUser) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

const RoutesList = ({loading, setLoading}) => {

  
  
  
  return (
    <Routes>
      <Route
        path={LOGIN_URL}
        element={
          <Form
            title="Login"
            loading={loading}
            setLoading={setLoading}
          />
        }/>
      <Route
        path={REGISTER_URL}
        element={
          <Form
            title="Register"
            loading={loading}
            setLoading={setLoading}
          />
        }/>
        <Route
          path={HOME_URL}
          element={
            <RequireAuth>
              <Home/>
            </RequireAuth>
          }
        />
        <Route
          path={CREATE_LEARNING_SPACE_URL}
          element={
            <RequireAuth>
              <CreateSpace setLoading={setLoading} loading={loading}/>
            </RequireAuth>
          }
        />
        <Route
          path={`${SPACES_URL}/:spaceId`}
          element={
            <RequireAuth>
              <Space setLoading={setLoading}/>
            </RequireAuth>
          }
        />
        <Route
          path={`${USERS_URL}/:uid`}
          element={
            <RequireAuth>
              <User/>
            </RequireAuth>
          }
        />
        <Route
          path={PROFILE_URL}
          element={
            <RequireAuth>
              <Profile/>
            </RequireAuth>
          }
        />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default RoutesList