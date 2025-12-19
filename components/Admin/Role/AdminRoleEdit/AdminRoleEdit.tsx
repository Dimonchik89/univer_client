import { Datagrid, Edit, List, SimpleForm, TextField, TextInput } from "react-admin";

const AdminRoleEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="name" label="Назва" />
            </SimpleForm>
        </Edit>
    );
};

export default AdminRoleEdit;
