import './App.scss';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Index from './pages/Index/Index';
import Search from './pages/Search/Search';
import Info from './pages/Info/Info';
import Favorites from './pages/Favorites/Favorites';

import routes from "./data/routes";

export default function App() {
  
  const router = createBrowserRouter([
    {
      path: routes.index,
      element: <Index />,
    },
    {
      path: routes.search,
      element: <Search />,
    },
    {
      path: routes.info,
      element: <Info />,
    },
    {
      path: routes.favorites,
      element: <Favorites />,
    }
  ]);
  
  return <RouterProvider router={router} />;
}
