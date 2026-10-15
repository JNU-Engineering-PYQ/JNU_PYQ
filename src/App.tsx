import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import BrowsePapers from "./pages/BrowsePapers";
import PaperDetails from "./pages/PaperDetails";
import Upload from "./pages/Upload";
import Admin from "./pages/Admin";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

/**
 * HashRouter is used so the static build works on GitHub Pages (and any
 * static host) with zero server config — deep links and refreshes resolve
 * to index.html. See README “Deploying to GitHub Pages”.
 *
 * To use clean URLs instead, swap HashRouter → BrowserRouter and add the
 * SPA fallback documented in the README (404.html copy of index.html).
 */
export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/papers" element={<BrowsePapers />} />
          <Route path="/papers/:id" element={<PaperDetails />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
