import React from "react";
import { Create, SimpleForm, TextInput } from "react-admin";

const ScheduleTableCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="tableId" label="ID таблицi" />
                <TextInput
                    source="groupRowIndex"
                    label="Номер рядка на якому назва групп -1 (вiдняти 1)"
                />
                <TextInput
                    label="Номер рядка з якого починается розклад на понедiлок -1 (вiдняти 1)"
                    source="Monday"
                />
                <TextInput
                    label="Номер рядка з якого починается розклад на вiвторок -1 (вiдняти 1)"
                    source="Tuesday"
                />
                <TextInput
                    label="Номер рядка з якого починается розклад на середу -1 (вiдняти 1)"
                    source="Wednesday"
                />
                <TextInput
                    label="Номер рядка з якого починается розклад на четвер -1 (вiдняти 1)"
                    source="Thursday"
                />
                <TextInput
                    label="Номер рядка з якого починается розклад на п'ятницю -1 (вiдняти 1)"
                    source="Friday"
                />
                <TextInput
                    label="Номер рядка з якого починается розклад на суботу -1 (вiдняти 1)"
                    source="Saturday"
                />
            </SimpleForm>
        </Create>
    );
};

export default ScheduleTableCreate;
