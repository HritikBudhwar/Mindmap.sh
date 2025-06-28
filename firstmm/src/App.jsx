import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MindMap from './MindMap';
import LoginPage from './FrontJigs/LoginPage';
import FrontPage from './FrontJigs/FrontPage';
import VisitMap from './component/VisitMap';
import SignupPage from './FrontJigs/SignuPage';
import OtherFile from './component/OtherFile';
import VisitOtherMap from './component/VisitOtherMap'
import UserProfile from './component/UserProfile';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/front" element={<FrontPage />} />
        <Route path="/mindmap" element={<MindMap />} />
        <Route path = "/visitmap" element={<VisitMap />}></Route>
        <Route path = "/signup" element = {<SignupPage />}/>
        <Route path = "/otherfile" element = {<OtherFile/>}></Route>
        <Route path = "/othervisitmap" element = {<VisitOtherMap/>}></Route>
        <Route path ="/selfprofile" element = {<UserProfile></UserProfile>}></Route>
      </Routes>
    </Router>
    
  );
}

export default App;
