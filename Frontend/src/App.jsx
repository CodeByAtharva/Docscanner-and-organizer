import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Placeholders for future routes */}
        <Route path="/login" element={<div className="flex items-center justify-center h-screen">Login Page Placeholder</div>} />
        <Route path="/signup" element={<div className="flex items-center justify-center h-screen">Signup Page Placeholder</div>} />
      </Routes>
    </Router>
  );
}

export default App;
