

export interface InitialValuesLogin {
	email: string;
	password: string;
}

export interface InitialValuesRegistration extends InitialValuesLogin {}

export interface InitialValuesForgotPassword {
	email: string
}