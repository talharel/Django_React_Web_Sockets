import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LobbyPage from './pages/Lobby/Lobby';
import CodeBlockPage from './pages/CodeBlock/CodeBlock';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LobbyPage />} />
        <Route path='/codeblock/:id' element={<CodeBlockPage />} />
      </Routes>
    </Router>
  );
}

export default App;
