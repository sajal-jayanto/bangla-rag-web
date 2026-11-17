import { useEffect } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import { GuestOnly, RequireAuth } from "./auth/RequireAuth";
import { AppLayout } from "./components/AppLayout";
import { Account } from "./pages/Account";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Projects } from "./pages/Projects";
import { Register } from "./pages/Register";
import { useAuthStore } from "./stores/authStore";

const router = createBrowserRouter([
  {
    element: <GuestOnly />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/projects" replace /> },
          { path: "/projects", element: <Projects /> },
          { path: "/projects/:id", element: <ProjectDetail /> },
          { path: "/account", element: <Account /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
]);

export default function App() {
  const loadMe = useAuthStore((s) => s.loadMe);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  return <RouterProvider router={router} />;
}
