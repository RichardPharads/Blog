import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Protected from '../pages/Protected'
import Blog from '../pages/Blog'
import Register from '../pages/Register'
import Login from '../pages/Login'
import Notfound from '../pages/Notfound'
import CreatePost from '../pages/CreatePost'
import BlogItem  from '../components/BlogItem'
import Profile from '../pages/UserBlogs'
import CommentSectionPage from './Commentsection'
import EditCommentPage from '../pages/EditCommentPage'
function AppContent() {
  
  return (
    <BrowserRouter>
      <Navigation/>
      <Routes>
        <Route path='/' element={<Blog/>}/>
        
        <Route path='/blog' element={<Blog/>}/>
        <Route path='/blog/:slug' element={<BlogItem/>}/> {/* Dynamic route */}

        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route element={<Protected />}>
          <Route path="/create" element={<CreatePost />} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/blog/:slug/comment' element={<CommentSectionPage/>}/>
          <Route path="/comment/:id/edit" element={<EditCommentPage />} />
          </Route>
        <Route path='*' element={<Notfound/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppContent