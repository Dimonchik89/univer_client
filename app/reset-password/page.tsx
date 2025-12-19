import ResetPasswordForm from '../../components/ResetPasswordForm/ResetPasswordForm';

interface ResetPasswordProps {
	searchParams: Promise<{
		token: string
	}>;
}

const ResetPassword = async ({ searchParams }: ResetPasswordProps) => {
	const { token } = await searchParams;

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="w-full max-w-md bg-white p-6 shadow rounded-lg">
				<ResetPasswordForm token={token}/>
			</div>
		</div>
	)
}

export default ResetPassword