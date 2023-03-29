import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// MUI component
import Box from "@mui/material/Box"
import Toolbar from '@mui/material/Toolbar'
import LinearProgress from '@mui/material/LinearProgress'
import Container from '@mui/material/Container'

// components
import Header from './components/common/Header/Header'
import CreateEditSpace from './components/CreateEditSpace/CreateEditSpace'
import Signinup from './components/Signinup/Signinup'
import ProfileEdit from './components/ProfileEdit/ProfileEdit'
import Footer from './components/common/Footer/Footer'

// Pages
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import User from './components/User/User'
import Space from './components/Space/Space'
import NotFound from './components/NotFound/NotFound'

// context 
import useAuth from './firebase/auth'

// constatns
import { HOME_URL, SIGN_IN_UP_URL, USERS_URL, SPACES_URL, PROFILE_URL, CREATE_SPACE_PAGE_TITLE, EDIT_SPACE_PAGE_TITLE } from './constants'


const RequireAuth = ({ children }) => {
  const { authUser } = useAuth()
  const  location = useLocation();

  if (!authUser) {
    return <Navigate to={SIGN_IN_UP_URL} state={{ from: location }} replace />;
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
    if (authUser && !isLoading && (location.pathname === SIGN_IN_UP_URL)) {
      navigate(HOME_URL)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, isLoading]);


  return (
      isLoading ? 
        <LinearProgress color="secondary"/>
      :
      <div>
          {loading && <LinearProgress color="secondary" sx={{zIndex: 1101, position: 'fixed', width: '100%'}}/>}
          <Header />
          <Box component="main" sx={{
            p: 3,
            minHeight: 'calc(100vh - 118px - 40px)'
            }}>
            <Toolbar />
            <Container>
              <Routes>
                  <Route
                    path={SIGN_IN_UP_URL}
                    element={
                      <Signinup/>
                    }
                  />
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
                      <Space/>
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
                  <Route
                    path={`${PROFILE_URL}/edit`}
                    element={
                      <RequireAuth>
                        <ProfileEdit
                          loading={loading}
                          setLoading={setLoading}
                        />
                      </RequireAuth>
                    }
                  />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Container>
          </Box>
          <Footer />
      </div>
  );
}


export default App;

