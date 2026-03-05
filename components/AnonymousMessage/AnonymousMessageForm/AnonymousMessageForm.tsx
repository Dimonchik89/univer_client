"use client";
import { TextField } from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { InitialValueAnonymousMessage } from "../../../types/types";
import Loader from "../../Loader/Loader";
import { complaintRoleQuery } from "../../../utils/query/complaint-role-query";
import { complaintRoleSendMessageMutation } from "../../../utils/mutation/complaintRole-sendMessage.mutation";

const AnonymousMessageForm = () => {
    const initialValue: InitialValueAnonymousMessage = {
        senderEmail: "",
        responsibleRoleId: "",
        message: "",
    };
    const { data, isLoading, error } = complaintRoleQuery();

    const { mutateAsync } = complaintRoleSendMessageMutation();

    const validationSchema = Yup.object({
        responsibleRoleId: Yup.string().required("Оберіть роль"),
        message: Yup.string()
            .min(10, "Повідомлення не менше 10 символiв")
            .required("Введіть повідомлення"),
    });

    const handleChangeRole = (
        event: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (str: string, id: string) => {}
    ) => {
        const value = event.target?.value.trim().toLowerCase();
        const role = data?.find((item) => item.name.toLowerCase() === value);

        setFieldValue("responsibleRoleId", role?.id || "");
        setFieldValue("senderEmail", role?.user?.email || "");
    };

    if (error) {
        if (error instanceof Error) {
            return <h2>{`Щось пiшло не так! ${error.message}`}</h2>;
        }
        return <h2>{`Щось пiшло не так! Спробуйде пiзнше`}</h2>;
    }

    return (
        <div className="mt-10">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full max-w-3/4 md:max-w-1/2 mx-auto">
                    <Formik
                        initialValues={initialValue}
                        validationSchema={validationSchema}
                        onSubmit={async (value, { setSubmitting, resetForm }) => {
                            await mutateAsync(value);
                            setSubmitting(false);
                            resetForm();
                        }}
                    >
                        {({
                            values,
                            isSubmitting,
                            handleChange,
                            handleBlur,
                            errors,
                            touched,
                            setFieldValue,
                        }) => (
                            <Form>
                                {data && (
                                    <div className="role-field mb-5">
                                        <label className="role-label">
                                            <input
                                                className="role-input"
                                                list="complaint-role"
                                                name="role"
                                                placeholder="Введіть назву ролі..."
                                                onChange={(event) =>
                                                    handleChangeRole(event, setFieldValue)
                                                }
                                            />
                                        </label>
                                        <datalist id="complaint-role">
                                            {data?.map(({ id, name, user }) => (
                                                <option key={id} value={name}>
                                                    {name}
                                                </option>
                                            ))}
                                        </datalist>

                                        {errors.responsibleRoleId && touched.responsibleRoleId && (
                                            <p className="validate-error-message">
                                                {errors.responsibleRoleId}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col">
                                    <TextField
                                        multiline
                                        rows={4}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#00a63e",
                                                },
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: "#00a63e",
                                            },
                                        }}
                                        label="Повiдомлення"
                                        name="message"
                                        variant="outlined"
                                        type="text"
                                        value={values.message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <p className="validate-error-message">
                                        {errors.message && touched.message && errors.message}
                                    </p>
                                </div>
                                <button
                                    className="button-primary"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Зачекайте..." : "Вiдправити"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}
        </div>
    );
};

export default AnonymousMessageForm;
