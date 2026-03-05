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
import AdminChatList from "../Chat/AdminChatList/AdminChatList";
import AdminChatEdit from "../Chat/AdminChatEdit/AdminChatEdit";
import ScheduleTableCreate from "../ScheduleTable/ScheduleTableCreate/ScheduleTableCreate";
import ScheduleTableList from "../ScheduleTable/ScheduleTableList/ScheduleTableList";
import AcademicGroupList from "../AcademicGroup/AcademicGroupList/AcademicGroupList";
import ScheduleTableEdit from "../ScheduleTable/ScheduleTableEdit/ScheduleTableEdit";
import ComplaintRoleList from "../ComplaintRole/ComplaintRoleList/ComplaintRoleList";
import ComplaintRoleCreate from "../ComplaintRole/ComplaintRoleCreate/ComplaintRoleCreate";
import ComplaintRoleEdit from "../ComplaintRole/ComplaintRoleEdit/ComplaintRoleEdit";

const AdminApp = () => {
    const a = 4;

    return (
        <Admin dataProvider={reactAdminProvider}>
            <Resource
                name="user"
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
                list={AcademicGroupList}
                edit={AdminAcademicGroupEdit}
                create={AdminAcademicGroupCreate}
            />
            <Resource
                name="event"
                list={AdminEventList}
                edit={AdminEventEdit}
                create={AdminEventCreate}
            />
            <Resource name="chat" list={AdminChatList} edit={AdminChatEdit} />
            <Resource
                name="schedule-table"
                list={ScheduleTableList}
                create={ScheduleTableCreate}
                edit={ScheduleTableEdit}
            />
            <Resource
                name="complaint-role"
                list={ComplaintRoleList}
                create={ComplaintRoleCreate}
                edit={ComplaintRoleEdit}
            />
        </Admin>
    );
};

export default AdminApp;
