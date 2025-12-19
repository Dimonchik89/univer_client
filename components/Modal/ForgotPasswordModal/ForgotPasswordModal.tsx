import { Box, Modal, TextField } from '@mui/material'
import { useForgotPasswordMutation } from '../../../utils/mutation/forgot-password-mutation';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { InitialValuesForgotPassword } from '../../../types/types';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface ForgotPasswordModalProps {
	isOpen: boolean;
	handleClose: () => void;
}

const ForgotPasswordModal = ({ isOpen, handleClose }: ForgotPasswordModalProps) => {
	const initialValues: InitialValuesForgotPassword = { email: "" };
	const validationSchema = Yup.object({
		email: Yup.string().email("Невірна електронна пошта").required("Поле обов'язкове")
	});
	const { mutate, isError, error } = useForgotPasswordMutation();

	const onSubmit = async (value: InitialValuesForgotPassword) => {
		await mutate(value);
		handleClose();
	}

	if(isError) {
		if(error instanceof AxiosError) {
			toast.error(error.response?.data.message || "Сталася помилка");
		} else {
			toast.error("Сталася помилка");
		}
	}

	return (
		<Modal open={isOpen} onClose={handleClose} aria-labelledby="edit-user-modal">
			<Box
			className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
			>
			<h2 className="text-xl font-bold mb-4 text-center">Введіть вашу пошту</h2>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={async (values, { setSubmitting}) => {
						onSubmit(values);
						setSubmitting(false);
					}}
				>
					{({ values, errors, touched, handleSubmit, handleChange, handleBlur, isSubmitting }) => (
						<form onSubmit={handleSubmit} className="flex flex-col gap-3">
							<div className='flex flex-col'>
								<TextField
									sx={{
										"& .MuiOutlinedInput-root": {
											"&.Mui-focused fieldset": {
												borderColor: "#00a63e",
											},
										},
										"& .MuiInputLabel-root.Mui-focused": {
											color: "#00a63e",
										}
									}}
									label="Пошта"
									name="email"
									variant="outlined"
									value={values.email}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<p className='validate-error-message'>
									{errors.email && touched.email && errors.email}
								</p>
							</div>

							<button
								type="submit"
								className="button-primary"
								disabled={isSubmitting}
							>
								Надiслати
							</button>
						</form>
					)}
				</Formik>
			</Box>
		</Modal>
	)
}

export default ForgotPasswordModal;