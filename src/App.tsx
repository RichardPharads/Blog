import React from 'react'
import {BrowserRouter, Route , Router , Routes} from 'react-router-dom'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import Notfound from './pages/Notfound'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import { Provider } from 'react-redux'
import {store} from './store/store'
import Navigation from './components/Navigation'

function App() {
  return (
  <Provider store={store}>
   <BrowserRouter>
    <Navigation/>
    <Routes>
      <Route path='*' element={<Notfound/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>} />
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/blog'  element={<Blog/>}/>
  </Routes>
</BrowserRouter>
</Provider>
);
}
export default App;