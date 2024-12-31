import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { APP_STORE } from "./core/redux/store";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { TaskPage } from "./pages/content/tasks/task.page";
import { MainLayout } from "./pages/content/MainLayout";
import { SessionLayout } from "./pages/session/SessionLayout";
import { RegisterPage } from "./pages/session/register.page";
import { LoginPage } from "./pages/session/login.page";
import { ForgotPage } from "./pages/session/forgot.page";
import { UserPage } from "./pages/content/user/user.page";
import { Provider as ThemeProvider } from "@/components/ui/provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={APP_STORE}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<TaskPage />} />
              <Route path="/user" element={<UserPage />} />
            </Route>
            <Route path="/session" element={<SessionLayout />}>
              <Route index element={<Navigate to="/session/login" />} />
              <Route path="/session/login" element={<LoginPage />} />
              <Route path="/session/register" element={<RegisterPage />} />
              <Route path="/session/forgot" element={<ForgotPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
