import React from "react";
import {
    CheckboxGroupInput,
    Edit,
    Error,
    Loading,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
    useEditController,
} from "react-admin";
import { Role } from "../../../../types/role";
import { AcademicGroup } from "../../../../types/academicGroup";

const AdminUserEdit = () => {
    const controller = useEditController();

    const { record: originalRecord, isLoading, error, refetch } = controller;

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <Error error={error} resetErrorBoundary={refetch} />;
    }

    if (!originalRecord) {
        return <Edit {...controller}>Запис не знайдено</Edit>;
    }

    const record = {
        ...originalRecord,
        roles: (controller.record.roles as Role[])?.map((item) => item.id),
        academic_groups: (controller.record.academic_groups as AcademicGroup[])?.map(
            (item) => item.id
        ),
    };

    if (!record) return null;

    return (
        <Edit {...controller}>
            <SimpleForm record={record}>
                <TextInput source="email" label="Пошта" readOnly={true} />
                <TextInput source="firstName" label="Ім'я" />
                <TextInput source="lastName" label="Прізвище" />
                <TextInput source="avatarUrl" />
                <ReferenceArrayInput source="roles" reference="role" perPage={999} label="Ролi">
                    <CheckboxGroupInput optionText="name" />
                </ReferenceArrayInput>
                <ReferenceArrayInput
                    source="academic_groups"
                    reference="academic-group"
                    label="Академічні групи"
                    perPage={999}
                >
                    <CheckboxGroupInput optionText="name" />
                </ReferenceArrayInput>
            </SimpleForm>
        </Edit>
    );
};

export default AdminUserEdit;
