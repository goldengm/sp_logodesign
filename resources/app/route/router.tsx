import React from "react";
import {
  Routes,
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import RouteLoading from "@/components/RouteLoading";
import Error404 from "@/components/404";
import PrivateRoute from "./privateRouter";
import RequireAuth from "./guard";
import AdminRoute from "./adminRoute";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import RequireAdmin from "./adminGuard";
import ResetPassword from "@/pages/auth/ResetPassword";
// import AdminRoute from "./adminRoute";

const SignIn = React.lazy(() => import("@/pages/auth/SignIn"));
const SignUp = React.lazy(() => import("@/pages/auth/SignUp"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route
        path="/user/*"
        element={
          <RequireAuth>
            <PrivateRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/*"
        element={
          <RequireAuth>
            <RequireAdmin>
              <React.Suspense fallback={<RouteLoading />}>
                <AdminRoute />
              </React.Suspense>
            </RequireAdmin>
          </RequireAuth>
        }
      />
      <Route
        path="/signin"
        element={
          <React.Suspense fallback={<RouteLoading />}>
            <SignIn />
          </React.Suspense>
        }
      />
      <Route
        path="/signup"
        element={
          <React.Suspense fallback={<RouteLoading />}>
            <SignUp />
          </React.Suspense>
        }
      />
      <Route
        path="/reset-password/:q"
        element={
          <React.Suspense fallback={<RouteLoading />}>
            <ResetPassword />
          </React.Suspense>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <React.Suspense fallback={<RouteLoading />}>
            <ForgotPassword />
          </React.Suspense>
        }
      />
      <Route path="/" element={<Navigate to="/user" replace />} />
      <Route path="*" element={<Error404 />} />
    </Route>
  )
);

export default router;
