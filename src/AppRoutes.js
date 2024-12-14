import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import PublicRoute from "./PublicRoute";
import { ROUTES } from "./common/constants";
import Login from "./components/Login";
import Playlist from "./components/Playlist";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: `${ROUTES.LOGIN}`,
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: ROUTES.MAIN,
      element: (
        <PrivateRoute>
          <Playlist />
        </PrivateRoute>
      ),
    },
    {
      path: "*",
      element: <Navigate to={`${ROUTES.LOGIN}`} replace />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
