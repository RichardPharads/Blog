import React from 'react'

import {format} from 'date-fns'

interface Author {
    name: string;
    avatar?: string;
}

interface BlogPost { 
    slug:string;
    title: string;
    excerpt: string;
    coverImage?:string;
    category:string;
    publishedAt?: string;
    readTimeMinutes: number;
    author: Author
}

interface BlogPostCardProps {
    post: BlogPost;
    className?: string
}   




function BlogCard({className='' , post}: BlogPostCardProps) {
    const {
         slug ,
         title , 
         excerpt ,
         coverImage ,
         category , 
         publishedAt , 
         readTimeMinutes , 
         author
        } = post

    const formatDate = publishedAt ? format(new Date (publishedAt) , 'MMM d, yyyy') : 'Recent'
  return (
    
    <div className='w-[300px] h-[450px] shadow-md  rounded-2xl'>
        <div className='image-container '>
            <div className='bg-red-600 w-full h-[200px] rounded-t-2xl '><img src={coverImage} alt={slug} />{}</div>
        </div>
        <div className='Card-body p-4'>
            <div className='flex items-center gap-4 py-2'>
                <h3 className='text-xs bg-neutral-700 rounded-md py-1 px-2 text-white'>{category}</h3>
                <div className='flex'>
                    <h2>{readTimeMinutes} min to read</h2>
                </div>
            </div>
            <div className='Card-title grid gap-2'>
                <h1 className='text-xl font-bold'>{title}</h1>
                <p className='text-md opacity-70'>{excerpt}</p>
            </div>
            <div className='Card-footer mt-4'>
                <div className='flex items-center gap-2 '>
                    <h3 className='font-medium'>{author.name}</h3>
                    <div className='author-info'>
                        <p className='text-sm text-gray-500'>{formatDate}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
   
  )
}

export default BlogCard