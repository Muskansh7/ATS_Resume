import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import Result from "./pages/Result";
import JobMatch from "./pages/JobMatch";

import Layout from "./components/Layout";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Layout with Navbar */}
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/result" element={<Result />} />
            <Route path="/job-match" element={<JobMatch />} />
          </Route>

          {/* Auth pages (no navbar if you want later) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
