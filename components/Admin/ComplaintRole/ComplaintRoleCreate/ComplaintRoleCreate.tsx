import React from "react";
import { AutocompleteInput, Create, ReferenceInput, SimpleForm, TextInput } from "react-admin";

const ComplaintRoleCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="name" label="Посада" />
                <ReferenceInput source="userId" reference="user">
                    <AutocompleteInput
                        label="Вiдповiдальна особа"
                        optionText={(record) =>
                            `${record.firstName} ${record.lastName} ${record.email}`
                        }
                        filterToQuery={(searchText) => ({ q: searchText })}
                    />
                </ReferenceInput>
            </SimpleForm>
        </Create>
    );
};

export default ComplaintRoleCreate;
