import BlogCard from '../components/BlogCard'
import { Link } from 'react-router-dom'

function Blog() {
  return (
    <div className=' bg-gray-100 flex gap-2'>
        <BlogCard 
            post={{
                slug: 'my-first-blog',
                title: 'My First Blog',
                excerpt: 'This is my first blog post.',
                category: 'Technology',
                publishedAt: '2024-01-01',
                readTimeMinutes: 5,
                author: {name: 'John Doe'}
            }}
            className='mt-4'
            />
             <BlogCard 
            post={{
                slug: 'my-first-blog',
                title: 'My First Blog',
                excerpt: 'This is my first blog post.',
                category: 'Technology',
                publishedAt: '2024-01-01',
                readTimeMinutes: 5,
                author: {name: 'John Doe'}
            }}
            className='mt-4'
            />
             <BlogCard 
            post={{
                slug: 'my-first-blog',
                title: 'My First Blog',
                excerpt: 'This is my first blog post.',
                category: 'Technology',
                publishedAt: '2024-01-01',
                readTimeMinutes: 5,
                author: {name: 'John Doe'}
            }}
            className='mt-4'
            />
    <Link to={'/logout'}>Logout</Link>
    </div>
  )
}

export default Blog