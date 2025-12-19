import {
    CheckboxGroupInput,
    DateTimeInput,
    Edit,
    Error,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
    useEditController,
} from "react-admin";
import Loader from "../../../Loader/Loader";
import { Role } from "../../../../types/role";
import { AcademicGroup } from "../../../../types/academicGroup";

const AdminEventEdit = () => {
    const controller = useEditController();

    const { record: originalRecord, isLoading, error, refetch } = controller;

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <Error error={error} resetErrorBoundary={refetch} />;
    }

    if (!originalRecord) {
        return <Edit {...controller}>Запис не знайдено</Edit>;
    }

    const record = {
        ...originalRecord,
        roles: (originalRecord.roles as Role[])?.map((item) => item.id),
        academic_groups: (originalRecord.academic_groups as AcademicGroup[])?.map(
            (item) => item.id
        ),
    };

    return (
        <Edit {...controller}>
            <SimpleForm record={record}>
                <TextInput source="title" label="Заголовок" />
                <TextInput source="message" label="Повiдомлення" />
                <TextInput source="location" label="Локацiя" />
                <TextInput source="registrationLink" label="Посилання" />
                <DateTimeInput source="scheduledAt" label="Час події" />
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

export default AdminEventEdit;
