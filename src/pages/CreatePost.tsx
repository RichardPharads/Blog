import React, { useState } from 'react'
import type { PostCreate } from '../services/post.services'
import { postService } from '../services/post.services'
import { useAuth } from '../hooks/AuthHook' 
import { useNavigate } from 'react-router-dom'
function CreatePost() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [file, setFile ] = useState<File>()

    const [postData, setPostData] = useState<PostCreate>({
        title: "",
        content: "",
        slug: "",
        excerpt: "",
        category: "",
        readtime: "",
        author: user?.email?.split('@')[0] || "",
        created_at: new Date(),
        published: true,
        user_id: user?.id || "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setPostData(prev => ({
                ...prev,
                [name]: checked
            }))
        } else {
            setPostData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim()
    }

    React.useEffect(() => {
        if (postData.title) {
            setPostData(prev => ({
                ...prev,
                slug: generateSlug(prev.title)
            }))
        }
    }, [postData.title])
    
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile){
            setFile(selectedFile)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        setError(null)
        setSuccess(false)
        
        if (!postData.title.trim()) {
            setError("Title is required")
            return
        }
        
        if (!postData.content.trim()) {
            setError("Content is required")
            return
        }
        
        if (!user?.id) {
            setError("You must be logged in to create a post")
            return
        }

        try {
            setIsLoading(true)
            const finalPostData: PostCreate = {
                title: postData.title.trim(),
                content: postData.content.trim(),
                slug: postData.slug.trim() || generateSlug(postData.title),
                excerpt: postData.excerpt.trim(),
                category: postData.category.trim(),
                readtime: postData.readtime.trim() || "5 min",
                author: postData.author.trim() || user.email?.split('@')[0] || "Anonymous",
                published: postData.published,
                created_at:postData.created_at,
                user_id: user.id,
            }
            
            console.log("Submitting post data:", finalPostData)
            
            const { data: post, error } = await postService.createPost(finalPostData , file)
            console.log("Successfuly Created " , post)
            if (error) {
                throw error
            }
            
            setSuccess(true)
            
            // Reset form on success
            navigate('/profile')
            setTimeout(() => {
                setPostData({
                    title: "",
                    content: "",
                    slug: "",
                    excerpt: "",
                    category: "",
                    readtime: "",
                    author: user.email?.split('@')[0] || "",
                    image_url: "",
                    published: false,
                    user_id: user.id || "",
                    created_at: user.created_at
                })
                setSuccess(false)
            }, 3000)
            
        } catch (err: any) {
            console.error("Error creating post:", err)
            setError(err.message || "Failed to create post. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>
            
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-700 font-medium">{error}</span>
                    </div>
                </div>
            )}
            
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-700 font-medium">Post created successfully!</span>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={postData.title}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Post Title"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                        Slug (auto-generated)
                    </label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={postData.slug}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="post-slug"
                    />
                </div>
                {/* Image URL*/}
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                        image_url *
                    </label>
                    <input
                        type="file"
                        id="image_url"
                        name="image_url"
                        
                        onChange={handleFile}
                        disabled={isLoading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Post image_url"
                    />
                </div>
                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Content *
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={postData.content}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        rows={10}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-sans"
                        placeholder="Write your post content here..."
                    />
                </div>

                {/* Excerpt */}
                <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                        Excerpt (Short Summary)
                    </label>
                    <textarea
                        id="excerpt"
                        name="excerpt"
                        value={postData.excerpt}
                        onChange={handleChange}
                        disabled={isLoading}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Brief summary of your post..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={postData.category}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Category</option>
                            <option value="technology">Technology</option>
                            <option value="programming">Programming</option>
                            <option value="web-development">Web Development</option>
                            <option value="mobile">Mobile</option>
                            <option value="design">Design</option>
                            <option value="business">Business</option>
                            <option value="lifestyle">Lifestyle</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="readtime" className="block text-sm font-medium text-gray-700 mb-2">
                            Read Time (minutes)
                        </label>
                        <input
                            type="text"
                            id="readtime"
                            name="readtime"
                            value={postData.readtime}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="e.g., 5 min"
                        />
                    </div>
                </div>

                {/* Author and Views */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                            Author Name
                        </label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={postData.author}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="Your name"
                        />
                    </div>

                   
                </div>

                {/* Published Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="published"
                        name="published"
                        checked={postData.published}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                        Publish immediately
                    </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                Creating Post...
                            </span>
                        ) : (
                            'Create Post'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreatePost