import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {useAuth} from '../hooks/AuthHook'

function LoginForm() {
  const navigate = useNavigate()
  const {login} = useAuth()
  const [email , setEmail ] = useState("")
  const [password , setPassword ] = useState("")
  const [error , setError ] = useState('')
  const [loading , setLoading ] = useState(false)

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    login(email , password)
    try {
      const result = await login(email, password)
      setLoading(true)
      if(result.error){
        setError(result.error.message)
      }
      return
    } catch (err:any) {
      setError(err.message)
    }
    finally{
      setLoading(false)
      navigate('/')
    }
  }
  return (
    <div className='place-items-center w-full'>
        <form onSubmit={handleSubmit} className='w-full md:w-[400px] shadow-md p-4 py-6 grid gap-2 rounded-md'>
          
            <div className=''>
              <h2 className='font-medium'>Sign In</h2>
              <p className='text-sm text-neutral-600'>Please fill in your details below</p>
            </div>
            <div className='grid gap-4'>
            
                <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded-md px-3 py-2 placeholder:text-md w-full text-sm font-medium text-neutral-600 '  placeholder='Email '/>
                
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded-md px-3 py-2 placeholder:text-md w-full text-sm font-medium text-neutral-600 '  placeholder='Password'/>
                
                <button className='py-1.5 border rounded-md text-sm bg-neutral-300 text-neutral-800 font-medium' type='submit'> Sign in</button>
                
                {
                  loading ? <h1>Loading</h1> : null
                }
                {
                  error ? <h1 className='text-red-500'>{error}</h1> : null
                }
            </div>
        </form>
        
    </div>
  )
}

export default LoginForm