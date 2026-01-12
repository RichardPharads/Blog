import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navigation from '../components/Navigation'
import Protected from '../pages/Protected'
import Blog from '../pages/Blog'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Notfound from '../pages/Notfound'
import CreatePost from '../pages/CreatePost'
import Profile from '../pages/Profile'
function AppContent() {
  
  
  return (
    <BrowserRouter>
      <Navigation/>
      <Routes>
        <Route path='/' element={<Blog/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route element={<Protected />}>
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path='*' element={<Notfound/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppContent