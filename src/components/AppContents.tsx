import {useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navigation from '../components/Navigation'
import Protected from '../pages/Protected'

import Blog from '../pages/Blog'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Notfound from '../pages/Notfound'

function AppContent() {
  const dispatch = useDispatch()
  useEffect(() => {
  }, [dispatch])

  return (
    <BrowserRouter>
      <Navigation/>
      <Routes>
        <Route path='/' element={<Blog/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route
          path='/create'
          element={
            <Protected user={null}>
                <h1>Hello</h1>
            </Protected>
          }
        />
        <Route path='*' element={<Notfound/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppContent