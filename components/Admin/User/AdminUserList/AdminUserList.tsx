import {
    Datagrid,
    FunctionField,
    List,
    ReferenceInput,
    SearchInput,
    SelectInput,
    TextField,
} from "react-admin";
import { UserProfile } from "../../../../types/user";

const userFilters = [
    <SearchInput source="q" alwaysOn />,
    <ReferenceInput source="roles" reference="role" label="Ролi" alwaysOn perPage={999}>
        <SelectInput optionText="name" />
    </ReferenceInput>,
    <ReferenceInput
        source="academic_groups"
        reference="academic-group"
        label="Академічна група"
        alwaysOn
    >
        <SelectInput optionText="name" />
    </ReferenceInput>,
];

const AdminUserList = () => {
    return (
        <List filters={userFilters}>
            <Datagrid rowClick="edit">
                <TextField source="email" label="Пошта" />
                <TextField source="firstName" label="Ім'я" />
                <TextField source="lastName" label="Прізвище" />
                <TextField source="avatarUrl" />
                <FunctionField
                    label="Ролi"
                    render={(item: UserProfile) => item.roles.map((role) => role.name).join(", ")}
                />
                <FunctionField
                    label="Академічні групи"
                    render={(item: UserProfile) =>
                        item.academic_groups.map((group) => group.name).join(", ")
                    }
                />
            </Datagrid>
        </List>
    );
};

export default AdminUserList;
