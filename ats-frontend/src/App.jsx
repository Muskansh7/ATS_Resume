import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Landing from "./pages/Landing.jsx";
import InstantAnalysis from "./pages/InstantAnalysis.jsx";
import JobMatch from "./pages/JobMatch.jsx";
import SkillExtraction from "./pages/SkillExtraction.jsx";
import WeaknessDetection from "./pages/WeaknessDetection.jsx";
import Upload from "./pages/Upload.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Result from "./pages/Result.jsx";

import Nav from "./components/Nav.jsx";

function App() {
  return (
    <>
      <Nav />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Pages */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route path="/result" element={<Result />} />


        <Route
          path="/instant-analysis"
          element={
            <ProtectedRoute>
              <InstantAnalysis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-match-score"
          element={
            <ProtectedRoute>
              <JobMatch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/skill-extraction"
          element={
            <ProtectedRoute>
              <SkillExtraction />
            </ProtectedRoute>
          }
        />

        <Route
          path="/weakness-detection"
          element={
            <ProtectedRoute>
              <WeaknessDetection />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
