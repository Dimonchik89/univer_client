import { Modal, Box, TextField } from '@mui/material'
import * as Yup from "yup";
import { Formik } from 'formik';
import { UpdateUser, UserProfile } from '../../../types/user';
import { useUpdateUserMutation } from '../../../utils/mutation/update-user-mutation';


interface UpdateProfileModalProps {
	isOpen: boolean;
	handleClose: () => void;
	profile: UserProfile;
}

const UpdateProfileModal = ({ isOpen, handleClose, profile }: UpdateProfileModalProps) => {
	const { mutate } = useUpdateUserMutation();

	const validationSchema = Yup.object({
		// email: Yup.string().email("Невірна електронна пошта").required("Поле обов'язкове"),
		firstName: Yup.string().min(2, "Мінімум 2 символи").required("Обов'язково"),
		lastName: Yup.string().min(2, "Мінімум 2 символи").required("Обов'язково"),
	});
	const initialValue: UpdateUser = {
		firstName: profile.firstName || "",
		lastName: profile.lastName || "",
		// email: profile.email || ""
	}

	return (
		<Modal open={isOpen} onClose={handleClose} aria-labelledby="edit-user-modal">
			<Box
			className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
			>
				<h2 className="text-xl font-bold mb-4 text-center">
					Редактування користувача
				</h2>

				<Formik
					initialValues={initialValue}
					validationSchema={validationSchema}
					onSubmit={async (values, { setSubmitting }) => {
						await mutate({ data: values, id: profile.id });
						setSubmitting(false);
						handleClose();
					}}
					>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting,
					}) => (
						<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
									label="Ім'я"
									name="firstName"
									variant="outlined"
									value={values.firstName}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<p className='validate-error-message'>
									{errors.firstName && touched.firstName && errors.firstName}
								</p>
							</div>
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
									label="Прізвище"
									name="lastName"
									variant="outlined"
									value={values.lastName}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<p className='validate-error-message'>
									{errors.lastName && touched.lastName && errors.lastName}
								</p>
							</div>
							{/* <div className='flex flex-col'>
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
							</div> */}
						<button
							className='button-primary'
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Зачекайте..." : "Змінити"}
						</button>
						</form>
					)}
				</Formik>
			</Box>
		</Modal>
	)
}

export default UpdateProfileModal