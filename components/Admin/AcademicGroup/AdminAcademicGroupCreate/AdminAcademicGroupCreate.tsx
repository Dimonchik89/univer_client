import React from "react";
import { Create, SimpleForm, TextInput } from "react-admin";

const AdminAcademicGroupCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="name" label="Назва" />
            </SimpleForm>
        </Create>
    );
};

export default AdminAcademicGroupCreate;
