import { Box, Checkbox, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import {
    Datagrid,
    Edit,
    FunctionField,
    ReferenceInput,
    SimpleForm,
    TextInput,
    TextField as RATextField,
    useDataProvider,
    useGetList,
    useInput,
    useRecordContext,
    useListController,
    ListContextProvider,
    Pagination,
} from "react-admin";
import { UserProfile } from "../../../../types/user";
import { useDebounce } from "use-debounce";

const ChatInfo = () => {
    const record = useRecordContext();

    if (!record) return null;

    return (
        <Box mb={2}>
            <Typography>
                <b>Chat ID:</b> {record.id}
            </Typography>

            <Typography>
                <b>Chat name:</b> {record.academicGroup?.name}
            </Typography>
        </Box>
    );
};

const AdminChatEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <ChatInfo />
                <ChatUsersSelector />
            </SimpleForm>
        </Edit>
    );
};
export default AdminChatEdit;

export const ChatUsersSelector = () => {
    const record = useRecordContext();

    const { field } = useInput({
        source: "userIds",
        defaultValue: [],
    });

    const [users, setUsers] = useState<UserProfile[]>(
        () => record?.chatMembers?.map((item: any) => item.user) || []
    );
    const [search, setSearch] = useState("");
    const [value] = useDebounce(search, 500);

    useEffect(() => {
        if (record?.chatMembers) {
            setUsers(record?.chatMembers?.map((item: any) => item.user));
        }
    }, [record]);

    useEffect(() => {
        field.onChange(users?.map((item: any) => ({ id: item?.id })));
    }, [users]);

    const listContext = useListController({
        resource: "user",
        perPage: 20,
        filter: search.length >= 2 ? { q: value } : {},
    });

    const toggleUser = (user: UserProfile) => {
        const isIncludes = !!users.find(({ id }) => id === user.id);

        if (isIncludes) {
            setUsers((prev) => prev.filter((item) => item.id !== user.id));
        } else {
            setUsers((prev) => [user, ...prev]);
        }

        console.log(field);
    };

    const getUserLabel = (user: UserProfile) => {
        let name =
            user.firstName || user.lastName
                ? `${user.firstName ?? ""} ${user.lastName ?? ""}`
                : user.email;

        let group = user.academic_groups?.map((item) => item.name).join(" ");
        return `${user.id} ${name} | Academic group: ${group}`;
    };

    return (
        <Box>
            <Typography variant="h6">Chat Members</Typography>
            {users.map((user) => (
                <Box key={user.id}>
                    <Checkbox
                        checked={!!users.find(({ id }) => id === user.id) || true}
                        onChange={() => {
                            toggleUser(user);
                        }}
                    />
                    {getUserLabel(user)}
                </Box>
            ))}
            <TextField
                fullWidth
                placeholder="Find user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mt: 2 }}
            />

            <ListContextProvider value={listContext}>
                {listContext.data?.map((user) => (
                    <Box key={user.id}>
                        <Checkbox
                            checked={!!users.find(({ id }) => id === user.id) || false}
                            onChange={() => {
                                toggleUser(user);
                            }}
                        />
                        {getUserLabel(user)}
                    </Box>
                ))}
                <Pagination />
            </ListContextProvider>
        </Box>
    );
};
