import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />

        {/* Placeholders for future routes */}
        <Route path="/login" element={<div className="flex items-center justify-center h-screen">Login Page Placeholder</div>} />
      </Routes>
    </Router>
  );
}

export default App;
