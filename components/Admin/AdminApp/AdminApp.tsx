"use client";
import { Admin, Resource, ListGuesser } from "react-admin";
import { reactAdminProvider } from "../../../utils/api/reactAdminProvider";
import AdminUserList from "../User/AdminUserList/AdminUserList";
import AdminUserEdit from "../User/AdminUserEdit/AdminUserEdit";
import AdminUserCreate from "../User/AdminUserCreate/AdminUserCreate";
import AdminRoleEdit from "../Role/AdminRoleEdit/AdminRoleEdit";
import AdminAcademicGroupEdit from "../AcademicGroup/AdminAcademicGroupEdit/AdminAcademicGroupEdit";
import AdminAcademicGroupCreate from "../AcademicGroup/AdminAcademicGroupCreate/AdminAcademicGroupCreate";
import AdminEventList from "../Event/AdminEventList/AdminEventList";
import AdminEventEdit from "../Event/AdminEventEdit/AdminEventEdit";
import AdminEventCreate from "../Event/AdminEventCreate/AdminEventCreate";

const AdminApp = () => {
    const a = 4;

    return (
        <Admin dataProvider={reactAdminProvider}>
            <Resource
                name="user"
                // list={ListGuesser}
                list={AdminUserList}
                edit={AdminUserEdit}
                create={AdminUserCreate}
                recordRepresentation="name"
            />
            <Resource
                name="role"
                list={ListGuesser}
                // edit={AdminRoleEdit}
                recordRepresentation="title"
            />
            <Resource
                name="academic-group"
                list={ListGuesser}
                edit={AdminAcademicGroupEdit}
                create={AdminAcademicGroupCreate}
            />
            <Resource
                name="event"
                list={AdminEventList}
                edit={AdminEventEdit}
                create={AdminEventCreate}
            />
        </Admin>
    );
};

export default AdminApp;
