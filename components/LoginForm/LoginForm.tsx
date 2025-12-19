"use client";
import { Formik } from "formik";
import * as Yup from "yup";
import { UseMutationResult } from '@tanstack/react-query';
import { InitialValuesLogin } from '../../types/types';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { EyeOff, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePasswordToggle } from '../../hooks/usePasswordToggle';

interface LoginFormProps {
	useHandleForm: () => UseMutationResult<any, Error, {
		email: string;
		password: string;
	}, unknown>;
	title: string,
	buttonTitle: string;
}

const LoginForm = ({ useHandleForm, title, buttonTitle }: LoginFormProps) => {
	const initialValues: InitialValuesLogin = { email: "", password: "" };
	const validationSchema = Yup.object({
		email: Yup.string().email("Невірна електронна пошта").required("Поле обов'язкове"),
		password: Yup.string().min(6, "Мінімум 6 символів").required("Обов'язково"),
	});

	const { mutate, isPending, isError, error } = useHandleForm();
	const {
		showPassword,
		handleClickShowPassword,
		handleMouseDownPassword,
		handleMouseUpPassword
	} = usePasswordToggle();


	return (
		<>
			<h2 className="text-2xl font-bold text-center text-green-600 mb-4 capitalize">{title}</h2>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={(values, { setSubmitting }) => {
					mutate(values);
					setSubmitting(false)
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
									label="Електронна пошта"
									name="email"
									variant="outlined"
									// type='email'
									value={values.email}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<p className='validate-error-message'>
									{errors.email && touched.email && errors.email}
								</p>
							</div>
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
										name="password"
										value={values.password}
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
								<p className='validate-error-message'>{errors.password && touched.password && errors.password}</p>
							</div>
						<button
							className='button-primary'
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Зачекайте..." : buttonTitle}
						</button>
						</form>
					)}
			</Formik>

			<button
				className="mt-4 w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-50 transition"
				onClick={() =>
					window.location.href = "http://localhost:3005/api/auth/google/login"
				}
			>
				<img src="/google-logo.png" alt="google" className="w-5 h-5" />
				<span>Увійти через Google</span>
			</button>
		</>
	);
}

export default LoginForm;
