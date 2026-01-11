import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { clearUser } from '../store/authSlice'
import { useAuth } from '../hooks/AuthHook'

const Authorized = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
    return (
        <>
            <li>
                <Link to="/create-post">Create Post</Link>
            </li>
            <li>
                <button onClick={onLogout}>Log out</button>
            </li>
            <li>
                <Link to="/profile">
                    {user?.user_metadata?.name || user?.email || 'Profile'}
                </Link>
            </li>
        </>
    )
}

function Navigation() {
    const navigate = useNavigate()
    const { authorized, user, logout } = useAuth()
    const authState = useSelector((state: any) => state.auth.authorized)
    const userState = useSelector((state: any) => state.auth.user)
    
    // Use useEffect to log state changes
    useEffect(() => {
        console.log("Auth state updated:", { 
            authorized, 
            authState, 
            user: user?.email,
            userState: userState?.email 
        })
    }, [authState, userState, authorized, user])
    
    const handleLogout = async () => {
        await logout()
        navigate('/') // Redirect to home after logout
    }
    
    // Show user info if logged in
    const renderUserInfo = () => {
        if (!user) return null
        
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                    {user.user_metadata?.name || user.email}
                </span>
                {user.user_metadata?.avatar_url && (
                    <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Avatar" 
                        className="w-8 h-8 rounded-full"
                    />
                )}
            </div>
        )
    }
    
    return (
        <div className='py-4 px-10 border-b flex justify-between items-center'>
            <div className="flex items-center gap-4">
                <Link to="/" className="text-xl font-bold">
                    MyBlog
                </Link>
                <Link to="/blog" className="hover:text-blue-600">
                    Blog
                </Link>
                {renderUserInfo()}
            </div>
            
            <div>
                <ul className='flex gap-4 items-center'>
                    {authorized ? (
                        <Authorized user={user} onLogout={handleLogout} />
                    ) : (
                        <>
                            <li>
                                <Link 
                                    to="/register" 
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/login" 
                                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                                >
                                    Sign In
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Navigation