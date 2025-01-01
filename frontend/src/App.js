import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';


export const Home = () => {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
function App() {
  return (
 <Routes>
   <Route path="/" element={<Home />} />
   <Route path="/login" element={<Login />} />
   <Route path="/register" element={<Register />} />
   <Route path="/email/verify/:code" element={<VerifyEmail />} />
 </Routes>
  );
}

export default App;
