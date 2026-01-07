import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Study from "./pages/Study";
import Stats from "./pages/Stats";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App: React.FC = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/study" element={<Study />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Layout>
);

export default App;