import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SignUpPage from "./Pages/SignUpPage";
import LogInPage from "./Pages/LogInPage";
import HomePage from "./Pages/HomePage";
import Search from "./Pages/Search";
import StudentPage from "./Pages/StudentPage";

import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

import AssessmentFramework from "./Pages/AssessmentFramework";
import Evaluate from "./Pages/Evaluate";
import SideBar from "./Components/SideBar";
import ViewPage from "./Pages/ViewPage";
import CreateRub from "./Pages/CreateRubric";
import { themeStore } from "./store/themesStore";
import CreateEvaluation from "./Pages/CreateEvaluation";
import EditRub from "./Pages/EditRubric";

const App = () => {
  const { isCheckingAuth, authUser, checkAuth } = useAuthStore();
  const { theme } = themeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen ">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      <SideBar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LogInPage /> : <Navigate to="/" />}
        />
        <Route
          path="/assessment-framework"
          element={
            authUser ? <AssessmentFramework /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/evaluate"
          element={authUser ? <Evaluate /> : <Navigate to="/login" />}
        />
        <Route
          path="/createrubric"
          element={authUser ? <CreateRub /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/edit-rubric"
          element={authUser ? <EditRub /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/create"
          element={authUser ? <CreateEvaluation /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/view/:id"
          element={authUser ? <ViewPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/search"
          element={authUser ? <Search /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/student"
          element={authUser ? <StudentPage /> : <Navigate to={"/login"} />}
        />
      </Routes>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;
