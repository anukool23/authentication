import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AppContainer from './components/AppContainer';
import Profile from './pages/Profile';
import Settings from './pages/Settings';


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
   <Route path="/" element={<AppContainer />} >
    <Route index element={<Profile />} />
    <Route path='settings' element={<Settings />} />
   </Route>
   <Route path="/login" element={<Login />} />
   <Route path="/register" element={<Register />} />
   <Route path="/email/verify/:code" element={<VerifyEmail />} />
   <Route path="/password/forgot" element={<ForgotPassword />} />
   <Route path="/password/reset" element={<ResetPassword />} />
 </Routes>
  );
}

export default App;