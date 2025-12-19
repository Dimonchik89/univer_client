import { useState } from 'react';

export const usePasswordToggle = () => {
		const [showPassword, setShowPassword] = useState(false);

		const handleClickShowPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault()
			setShowPassword((show) => !show)
		};

		const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
		};

		const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
		};

	return { showPassword, handleClickShowPassword, handleMouseDownPassword, handleMouseUpPassword };
}