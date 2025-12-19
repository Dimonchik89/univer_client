import Link from 'next/link'
import React from 'react'

const NotEnter = () => {
  return (
	<div className='flex justify-center mt-10'>
		<div className='flex flex-col items-center'>
			<h2>Вам потрiбно увiйти</h2>
			<Link className='text-green-600' href="/login">Login</Link>
		</div>
	</div>
  )
}

export default NotEnter