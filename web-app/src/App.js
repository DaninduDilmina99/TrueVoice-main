import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingPage from "./pages/Landing";
import HomePage from './pages/Home';
import DocumentationPage from './pages/Documentation';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
