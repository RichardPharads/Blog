import { useState } from 'react'
import { useAuth } from '../hooks/AuthHook'


function RegisterForm() {
  const {signup} = useAuth()
  const [name , setName ] = useState("")
  const [email , setEmail ] = useState("")
  const [password , setPassword ] = useState("")
  const [error , setError ] = useState<string | null>(null)
  
  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const {data , error} = await signup(email ,password , {name})
    if(error){
      setError(error.message)
    }else{
      console.log("Sucessfully created" , data?.user?.email)
    }
  }

  return (
    <div className='w-full place-items-center'>
        <form onSubmit={handleSubmit} className='w-full md:w-[400px] shadow-md p-4 py-6 grid gap-2 rounded-md'>
          
            <div className=''>
              <h2 className='font-medium'>User information</h2>
              <p className='text-sm text-neutral-600'>Please fill in your details below</p>
            </div>
            <div className='grid gap-4'>
                <input type="text" onChange={(e) => setName(e.target.value)} value={name} className='border rounded-md px-3 py-2 placeholder:text-md w-full text-sm font-medium text-neutral-600 '  placeholder='Full Name '/>
            
                <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded-md px-3 py-2 placeholder:text-md w-full text-sm font-medium text-neutral-600 '  placeholder='Email '/>
                
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded-md px-3 py-2 placeholder:text-md w-full text-sm font-medium text-neutral-600 '  placeholder='Password'/>
                
                <button className='py-1.5 border rounded-md text-sm bg-neutral-300 text-neutral-800 font-medium' type='submit'> Create</button>
                {
                error ? <h3 className='text-sm text-red-500'>{error}</h3> : null
                }
            </div>
        </form>
    </div>
  )
}

export default RegisterForm