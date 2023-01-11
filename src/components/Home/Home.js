import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({me}) => {
  const navigate = useNavigate()
  useEffect(() => {
    const authToken = sessionStorage.getItem('Auth Token')
    if (authToken) {
      navigate('/home')
    } else {
      navigate('/login')
    }
  }, [navigate]);
  return (
    <h1>Welcome home {me.displayName}</h1>
  )
}

export default Home