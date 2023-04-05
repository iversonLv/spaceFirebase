import { RouterProvider } from 'react-router-dom'
// Routes
import routes from './Routes'

const App = () => {
   return (
    <RouterProvider router={routes} />
  );
}

export default App;
