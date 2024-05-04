//Import from react-router-dom
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//Import components
import Root from "./pages/Root";
import ErrorPage from "./pages/ErrorPage";

import LoginPage from "./pages/LoginPage";
import { action as authAction } from "./components/AuthForm";
import { action as logoutAction } from "./pages/Logout";
import ProtectedAuthRoute from "./components/ProtectedAuthRoute";
import ProtectedRoutes from "./components/ProtectedRoutes";
import IndexPage from "./pages/IndexPage";
import OrderDetailPage, {
  loader as orderDetailLoader,
} from "./pages/OrderDetailPage";

//Defines  routes via  createBrowerRouter func
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <Root />
      </ProtectedRoutes>
    ),
    errorElement: <ErrorPage />,

    children: [
      {
        index: true,
        element: <IndexPage />,
      },

      {
        path: "/logout",
        element: null,
        action: logoutAction,
      },
      {
        path: ":orderId",
        element: <OrderDetailPage />,
        loader: orderDetailLoader,
      },
    ],
  },
  {
    path: "login",
    element: (
      <ProtectedAuthRoute>
        <LoginPage />
      </ProtectedAuthRoute>
    ),
    action: authAction,
  },
]);

function App() {
  //Render Router Component Tree
  return <RouterProvider router={router} />;
}

export default App;
