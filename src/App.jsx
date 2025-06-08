import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Train from './pages/Train';

function App() {
  return (
    <div style={{ height: '100%' }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/train" element={<Train />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
