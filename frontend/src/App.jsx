import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Verification from './pages/Verification';
import RecordDetails from './pages/RecordDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Iske andar jo bhi routes hain, un sabme Sidebar aur Navbar dikhega */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="verification" element={<Verification />} />
          <Route path="record/:id" element={<RecordDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;