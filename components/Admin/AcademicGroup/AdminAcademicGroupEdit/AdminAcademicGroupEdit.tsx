import React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";

const AdminAcademicGroupEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="name" label="Назва" />
            </SimpleForm>
        </Edit>
    );
};

export default AdminAcademicGroupEdit;
