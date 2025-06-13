import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import AccessLog from "./pages/AccessLog";
import Users from "./pages/Users";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="Users" element={<Users />} />
          <Route path="AccessLog" element={<AccessLog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
