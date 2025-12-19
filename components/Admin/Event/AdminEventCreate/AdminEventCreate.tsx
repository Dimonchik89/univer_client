import {
    CheckboxGroupInput,
    Create,
    DateTimeInput,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
} from "react-admin";

const AdminEventCreate = () => {
    return (
        <Create>
            <SimpleForm>
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
        </Create>
    );
};

export default AdminEventCreate;
