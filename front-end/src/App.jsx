import {Route, Routes} from 'react-router-dom';
import Login from './pages/login/login';
import BankFeed from './pages/bankFeed';
import SelfProfile from './pages/profiles/selfProfile';
import SocialFeed from './pages/socialFeed';
import './App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <div className="App mt-2 mt-2">
      <Routes>
        {!token ? (
          <Route path='*' element={<Login/>} />
        ) : (
          <>
            <Route path='/*' element={<SocialFeed/>} />
            <Route path='/social-feed' element={<SocialFeed/>} />
            <Route path='/bank-feed' element={<BankFeed/>} />
            <Route path='/self-profile' element={<SelfProfile/>} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
