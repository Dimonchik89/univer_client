export interface InitialValuesLogin {
    email: string;
    password: string;
}

export interface InitialValuesRegistration extends InitialValuesLogin {}

export interface InitialValuesForgotPassword {
    email: string;
}

export interface InitialValueAnonymousMessage {
    senderEmail: string;
    responsibleRoleId: string;
    message: string;
}
