import React from 'react'
import { Navigate } from 'react-router-dom'

interface User {
    id: string,
    name: string,
    email: string,
    role: string,
    avatar?: string,
}
interface ProtectedProps { 
    user: User | null
    children: React.ReactNode
}

function Protected({user, children}: ProtectedProps) {
  return (
    user ?.role === 'user' ? children : <Navigate to="/login" />
  ) 
}

export default Protected