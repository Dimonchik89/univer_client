"use client"

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react'
import * as Yup from 'yup';
import axiosInstance from '../../utils/axios/axios-interceptor';
import "dayjs/locale/uk";

// Добавить валидацю yup
const AdminEventForm = () => {
	const [value, setValue] = useState(null);

	// Добавить валидацю yup
	const handleChange = (newValue: any) => {
		const utcString = newValue.toISOString();
		console.log("UTC:", utcString);
		setValue(newValue);
	};

	// Добавить валидацю yup
	return (
    <>
      <div>AdminEventForm</div>
      <Formik
        initialValues={{ title: "", content: "" }}
        validate={(values) => {
          const errors: { title: string; content: string } = { title: "", content: "" };
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const res = {
            ...values,
            scheduledAt: value,
            academic_groups: [{ id: "34635f83-0f44-443f-a484-58769af7526c" }],
            roles: [{ id: "3b5cd60b-c7d4-466e-a52a-478a6c15e468" }],
          };

          const { data } = await axiosInstance("/api/event", {
            method: "POST",
            data: res,
          });

          console.log(data);

          // setTimeout(() => {
          // 	alert(JSON.stringify(res, null, 2));
          // 	setSubmitting(false);
          // }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="title" />
            <ErrorMessage name="title" component="div" />
            <Field type="text" name="content" />
            <ErrorMessage name="content" component="div" />

            {/* <Field type="email" name="email" />
						<ErrorMessage name="email" component="div" />
						<Field type="password" name="password" />
						<ErrorMessage name="password" component="div" /> */}
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateTimePicker label="Дата и время" value={value} onChange={handleChange} />
      </LocalizationProvider>
    </>
  );
}

export default AdminEventForm