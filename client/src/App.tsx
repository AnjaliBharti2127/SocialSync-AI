// import {Routes, Route}  from 'react-router-dom';
// import Home from './pages/Home';
// // import Sidebar from './components/Sidebar';
// import Login from './pages/Login';
// import Layout from './components/Layout';
// import Dashboard from './pages/Dashboard';
// import AIComposer from './pages/AIComposer';
// import Schedule from './pages/Schedule';
// import Accounts from './pages/Accounts';

// function App() {
//   return (
//    <Routes>
//   <Route path="/" element={<Home />} />
//   <Route path="/login" element={<Login />} />

//   <Route element={<Layout />}>
//     <Route path="dashboard" element={<Dashboard />} />
//     <Route path="aicomposer" element={<AIComposer />} />
//     <Route path="schedule" element={<Schedule />} />
//     <Route path="accounts" element={<Accounts />} />
//   </Route>
// </Routes>
//   );
// }

// export default App;
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import AIComposer from "./pages/AIComposer";
import Schedule from "./pages/Schedule";
import Accounts from "./pages/Accounts";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Layout Routes */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Accounts />} />
        <Route path="/scheduler" element={<Schedule />} />
        <Route path="/ai-composer" element={<AIComposer />} />
      </Route>
    </Routes>
  );
}

export default App; 