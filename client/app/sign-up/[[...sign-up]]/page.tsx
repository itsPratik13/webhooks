import { SignUp } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
        <SignUp/>
    </div>
  )
}

export default page