"use client"
import { useState } from 'react'
import ForgotPasswordModal from '../../Modal/ForgotPasswordModal/ForgotPasswordModal'
import LoginForm from '../../LoginForm/LoginForm'
import { useLoginMutation } from '../../../utils/mutation/login-mutation'
import Link from 'next/link'

const SigninWrapper = () => {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => {
		setIsOpen(true);
	}
	const handleClose = () => {
		setIsOpen(false);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="w-full max-w-md bg-white p-6 shadow rounded-lg">
				<LoginForm
					useHandleForm={useLoginMutation}
					title='Увійти'
					buttonTitle='Увійти'
				/>

				<div className='mt-6 flex justify-center items-center'>
					<Link className='text-green-600' href="/signup">
						Або зареєструйтесь
					</Link>
				</div>
				<div className='mt-3 flex justify-center items-center'>
					<button
						className='text-gray-600 text-sm cursor-pointer'
						onClick={handleOpen}
					>
						Забув пароль
					</button>
				</div>
			</div>
			<ForgotPasswordModal isOpen={isOpen} handleClose={handleClose}/>
		</div>
	)
}

export default SigninWrapper;