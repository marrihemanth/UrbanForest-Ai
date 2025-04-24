import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Trees from './pages/Trees';
import TreeForm from './pages/TreeForm';
import PlantingRecords from './pages/PlantingRecords';
import TreeRecommendation from './pages/TreeRecommendation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trees"
              element={
                <ProtectedRoute>
                  <Trees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tree-form"
              element={
                <ProtectedRoute>
                  <TreeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/planting-records"
              element={
                <ProtectedRoute>
                  <PlantingRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommend-trees"
              element={
                <ProtectedRoute>
                  <TreeRecommendation />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
