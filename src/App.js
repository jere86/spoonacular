import './App.css';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Search from './pages/Search/Search';
import Info from './pages/Info/Info';
import routes from "./data/routes";

export default function App() {
  
  const router = createBrowserRouter([
    {
      path: routes.search,
      element: <Search />,
    },
    {
      path: routes.info,
      element: <Info />,
    },
  ]);
  
  return <RouterProvider router={router} />;
}
