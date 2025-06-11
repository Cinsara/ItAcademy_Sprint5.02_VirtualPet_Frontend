import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Train from './pages/Train';
import Shop from './pages/Shop';
import Compete from './pages/Compete';

function App() {
  return (
    <div style={{ height: '100%' }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/train" element={<Train />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/compete" element={<Compete />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
