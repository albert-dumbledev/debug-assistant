import { Routes, Route } from 'react-router-dom';
import LogIngester from './pages/LogIngester';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LogIngester />} />
      </Routes>
    </div>
  );
}

export default App; 