import React from 'react'
import { Link } from 'react-router-dom'

function Notfound() {
  return (
    <div>
        <h2>Not Found</h2>
        <Link to='/'>Go to Home</Link>
    </div>
  )
}

export default Notfound