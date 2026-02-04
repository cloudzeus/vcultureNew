import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import JournalPage from './pages/JournalPage';
import JournalPostPage from './pages/JournalPostPage';

import { ContactProvider } from './context/ContactContext';
import ContactModal from './components/ContactModal';

import SmoothScroll from './components/SmoothScroll';

function App() {
  return (
    <ContactProvider>
      <SmoothScroll>
        <Router>
          <ContactModal />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/:postId" element={<JournalPostPage />} />
          </Routes>
        </Router>
      </SmoothScroll>
    </ContactProvider>
  );
}

export default App;