import { useEffect} from 'react'
import { createHashRouter, Navigate, Outlet, useLocation, useNavigate} from "react-router-dom"

// constatns
import { HOME_URL, SIGN_IN_UP_URL, USERS_URL, SPACES_URL, PROFILE_URL, CREATE_SPACE_PAGE_TITLE, EDIT_SPACE_PAGE_TITLE } from './constants'

// Components
import Signinup from "./components/Signinup/Signinup"
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import User from './components/User/User'
import Space from './components/Space/Space'
import NotFound from './components/NotFound/NotFound'
import Header from './components/common/Header/Header'
import CreateEditSpace from './components/CreateEditSpace/CreateEditSpace'
import ProfileEdit from './components/ProfileEdit/ProfileEdit'
import Footer from './components/common/Footer/Footer'


// context 
import useAuth from './firebase/auth'
import { Box, Container } from "@mui/material"
import ProgressLoading from './components/common/ProgressLoading/ProgressLoading'

const RequireAuth = ({ children }) => {
  const { authUser } = useAuth()
  const  location = useLocation();

  if (!authUser) {
    return <Navigate to={SIGN_IN_UP_URL} state={{ from: location }} replace />;
  }

  return children;
}

const Layout = () => {
  const { authUser, isLoading } = useAuth()
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // if current login use and loading end
    // and current path is not login and register page, will direct to home page
    if (authUser && !isLoading && (location.pathname === SIGN_IN_UP_URL)) {
      navigate(HOME_URL)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, isLoading]);
  return (
    isLoading ? <ProgressLoading />
      :
      <>
        <Header />
        <Box component="main" sx={{
        p: '90px 24px 24px',
        minHeight: 'calc(100vh - 118px - 40px)'
        }}>
          <Container>
              <Outlet />
          </Container>
        </Box>
        <Footer />
      </>
  )
}

export const routes = createHashRouter(
  [{
    element: <Layout />,
    children: [
      {
        path: SIGN_IN_UP_URL,
        element: <Signinup />
      },
      {
        path: HOME_URL,
        element: <Home />
      },
      {
        path: `${SPACES_URL}/:spaceId`,
        element: <Space />
      },
      // Logined
      {
        path: `${USERS_URL}/:uid`,
        element: <RequireAuth>
                  <User/>
                </RequireAuth>
      },
      {
        path: PROFILE_URL,
        element: <RequireAuth>
                  <Profile/>
                </RequireAuth>
      },
      {
        path: `${PROFILE_URL}/edit`,
        element: <RequireAuth>
                  <ProfileEdit/>
                </RequireAuth>
      },
      {
        path: `${SPACES_URL}/create`,
        element: <RequireAuth>
                  <CreateEditSpace
                    pageTitle={CREATE_SPACE_PAGE_TITLE}
                  />
                </RequireAuth>
      },
      {
        path:`${SPACES_URL}/:spaceId/edit`,
        element: <RequireAuth>
                  <CreateEditSpace
                    pageTitle={EDIT_SPACE_PAGE_TITLE}
                  />
                </RequireAuth>
      },
      // wildcard
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }]
)

export default routes