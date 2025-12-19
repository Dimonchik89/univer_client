import React from "react";
import {
    CheckboxGroupInput,
    Create,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
} from "react-admin";

const AdminUserCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="email" label="Пошта" />
                <TextInput source="password" label="Пароль" />
                <TextInput source="firstName" label="Ім'я" />
                <TextInput source="lastName" label="Прізвище" />
                <TextInput source="avatarUrl" />
                <ReferenceArrayInput source="roles" reference="role" perPage={999} label="Ролi">
                    <CheckboxGroupInput optionText="name" />
                </ReferenceArrayInput>
                <ReferenceArrayInput
                    source="academic_groups"
                    reference="academic-group"
                    perPage={999}
                    label="Академiчнi групи"
                >
                    <CheckboxGroupInput optionText="name" />
                </ReferenceArrayInput>
            </SimpleForm>
        </Create>
    );
};

export default AdminUserCreate;
