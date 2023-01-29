import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// MUI component
import { Box } from "@mui/system"
import Toolbar from '@mui/material/Toolbar'
import LinearProgress from '@mui/material/LinearProgress'

// components
import Form from './components/common/Form/Form'
import Header from './components/common/Header/Header'

// Pages
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import User from './components/User/User'
import Space from './components/Space/Space'
import NotFound from './components/NotFound/NotFound'

// context 
import useAuth from './firebase/auth'

// constatns
import { HOME_URL, LOGIN_URL, REGISTER_URL, USERS_URL, SPACES_URL, PROFILE_URL, CREATE_SPACE_PAGE_TITLE, EDIT_SPACE_PAGE_TITLE } from './constants'
import CreateEditSpace from './components/CreateEditSpace/CreateEditSpace'


const RequireAuth = ({ children }) => {
  const { authUser } = useAuth()
  const  location = useLocation();

  if (!authUser) {
    return <Navigate to={LOGIN_URL} state={{ from: location }} replace />;
  }

  return children;
}

const App = () => {
 
  const { authUser, isLoading } = useAuth()
  const location = useLocation();
  const navigate = useNavigate();
  // loading state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if current login use and loading end
    // and current path is not login and register page, will direct to home page
    if (authUser && !isLoading && (location.pathname === LOGIN_URL || location.pathname === REGISTER_URL)) {
      navigate(HOME_URL)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, isLoading]);


  return (
      isLoading ? 
        <LinearProgress color="secondary"/>
      :
      <div>
          {loading && <LinearProgress color="secondary" sx={{zIndex: 1101}}/>}
          <Header />
          <Box component="main" sx={{ p: 3 }}>
            <Toolbar /> 
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
                    <Home/>
                  }
                />
                <Route
                  path={`${SPACES_URL}/create`}
                  element={
                    <RequireAuth>
                      <CreateEditSpace
                        setLoading={setLoading}
                        loading={loading}
                        pageTitle={CREATE_SPACE_PAGE_TITLE}
                      />
                    </RequireAuth>
                  }
                />
                <Route
                  path={`${SPACES_URL}/:spaceId/edit`}
                  element={
                    <RequireAuth>
                      <CreateEditSpace
                        setLoading={setLoading}
                        loading={loading}
                        pageTitle={EDIT_SPACE_PAGE_TITLE}
                      />
                    </RequireAuth>
                  }
                />
                <Route
                  path={`${SPACES_URL}/:spaceId`}
                  element={
                    <Space setLoading={setLoading}/>
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
          </Box>
      </div>
  );
}


export default App;

