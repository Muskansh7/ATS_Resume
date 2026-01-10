import { Outlet } from "react-router-dom";
import Nav from "./Nav.jsx";
import "../landing.css";

export default function Layout() {
  return (
    <>
      <Nav />
      <div className="page-offset">
        <Outlet />
      </div>
    </>
  );
}
