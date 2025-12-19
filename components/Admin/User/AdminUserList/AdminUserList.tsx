import { Datagrid, FunctionField, List, TextField } from "react-admin";
import { UserProfile } from "../../../../types/user";

const AdminUserList = () => {
    return (
        <List>
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
