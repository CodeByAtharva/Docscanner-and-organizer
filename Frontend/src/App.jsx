import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentDetail from './pages/DocumentDetail';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/documents/:id"
          element={
            <RequireAuth>
              <DocumentDetail />
            </RequireAuth>
          }
        />

        {/* Placeholders for future routes */}
      </Routes>
    </Router>
  );
}

export default App;
