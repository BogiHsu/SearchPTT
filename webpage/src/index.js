import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Home from "./apps/home"
import Search from "./apps/search"
import Analyze from "./apps/analyze"
import Podcast from "./apps/podcast"
import About from "./apps/about"
import NoPage from "./apps/nopage"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="analyze" element={<Analyze />} />
          <Route path="podcast" element={<Podcast />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
