// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import PredictionPage from './pages/PredictionPage';

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/predict" element={<PredictionPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import Home from './pages/Home';
import PredictionPage from './pages/PredictionPage';
import ResultPage from './pages/ResultPage';

export default function App() {
  return (
    <BrowserRouter>
      {/* Toaster diletakkan di luar Routes agar selalu siap sedia */}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predict" element={<PredictionPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}