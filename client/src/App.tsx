import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const SignUp = lazy(() => import('./routes/SignUp'));
const Login = lazy(() => import('./routes/Login'));
const NavBar = lazy(() => import('./components/NavBar'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar />
        <Routes>
          <Route path="/*" element={<Home />}/>
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/login" element={<Login />}/>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
