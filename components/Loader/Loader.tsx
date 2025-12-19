import React from 'react'
import css from "./loader.module.css";


const Loader = () => {
  return (
	<div className='flex justify-center mt-3'>
		<div className={css['lds-ripple']}><div></div><div></div></div>
	</div>
  )
}

export default Loader