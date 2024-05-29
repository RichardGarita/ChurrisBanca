import {Route, Routes} from 'react-router-dom';
import Login from './pages/login/login';
import SocialFeed from './pages/socialFeed';
import './App.css';

function App() {
  return (
    <div className="App mt-2">
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/social-feed' element={<SocialFeed/>} />
      </Routes>
    </div>
  );
}

export default App;
