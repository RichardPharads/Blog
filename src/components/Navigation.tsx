import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {setUser} from '../store/authSlice'
import { useAppSelector } from '../hooks'
const navigation = [
    {
        name: 'home',
        path: '/',
    },
    {
        name: 'about',
        path: '/about',
    },
    {
        name: 'register',
        path: '/register'
    },
    {
        name: 'login',
        path: '/login'
    },
    {
        name: 'logout',
        path: '/logout'
    }
]
function Navigation() {
    return (
    <div className='py-4 px-10 border flex justify-between'>
        This is Navigation
        <div>
            <ul className='flex gap-4'>
                {
                    navigation.map(item => (
                        <Link to={item.path}>
                        <li key={item.name}>{item.name}</li>
                        </Link>
                    ))
                }
            </ul>
        </div>
    </div>
  )
}

export default Navigation