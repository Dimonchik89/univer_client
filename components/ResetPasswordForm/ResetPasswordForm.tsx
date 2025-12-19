"use client"
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from "yup";
import { useResetPasswordMutation } from '../../utils/mutation/reset-password-mutation';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { usePasswordToggle } from '../../hooks/usePasswordToggle';

interface ResetPasswordFormProps {
	token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
	const { mutate, isError, error } = useResetPasswordMutation();

	const validationSchema = Yup.object({
		newPassword: Yup.string().min(6, "Мінімум 6 символів").required("Обов'язково"),
	});

	const {
		showPassword,
		handleClickShowPassword,
		handleMouseDownPassword,
		handleMouseUpPassword
	} = usePasswordToggle();

	const handleSubmit = (values: { newPassword: string }) => {
		const obj = {
			newPassword: values.newPassword,
			token
		}
		mutate(obj)
	}

	if(isError) {
		if(error instanceof AxiosError) {
			toast.error(error.response?.data.message || "Сталася помилка");
		} else {
			toast.error("Сталася помилка");
		}
	}

	return (
		<>
			<h1 className='mb-4 text-center font-semibold text-xl'>
				Введіть новий пароль
			</h1>
			<Formik
				initialValues={{ newPassword: "" }}
				validationSchema={validationSchema}
				onSubmit={(values, { setSubmitting }) => {
					setSubmitting(false);
					handleSubmit(values)
				}}
			>
				{({ values, errors, touched, handleSubmit, handleChange, handleBlur, isSubmitting }) => (
						<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div className='flex flex-col'>
							<FormControl variant="outlined">
								<InputLabel
									htmlFor="outlined-adornment-password"
									sx={{
										"&.Mui-focused": {
											color: "#00a63e"
										}
									}}
								>
									Password
								</InputLabel>
								<OutlinedInput
									sx={{
										"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
											borderColor: "#00a63e",
										},
									}}
									id="outlined-adornment-password"
									type={showPassword ? 'text' : 'password'}
									name="newPassword"
									value={values.newPassword}
									onChange={handleChange}
									onBlur={handleBlur}
									endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label={
												showPassword ? 'hide the password' : 'display the password'
											}
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											onMouseUp={handleMouseUpPassword}
											edge="end"
										>
										{showPassword ? <EyeOff /> : <Eye />}
										</IconButton>
									</InputAdornment>
									}
									label="Password"
								/>
							</FormControl>
							<p className='validate-error-message'>{errors.newPassword && touched.newPassword && errors.newPassword}</p>
						</div>

						<button
							type="submit"
							className="button-primary"
							disabled={isSubmitting}
						>
							Задати новий пароль
						</button>
					</form>
				)}
			</Formik>
		</>
	)
}

export default ResetPasswordForm