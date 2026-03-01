"use client";

import { useEffect } from "react";
import { Group, ScheduleResponse } from "../../../types/schedule";
import { DecodeToken } from "../../../types/user";
import { useProfileQuery } from "../../../utils/query/profile-query";
import GroupSchedule from "../../Group/GroupSchedule/GroupSchedule";
import GroupSelect from "../../Group/GroupSelect/GroupSelect";
import { useRouter, useSearchParams } from "next/navigation";

interface WrapperProps {
    groups: { data: { results: Group[] } | null; error: string | null } | null;
    // schedule: { data: ScheduleResponse | null; error: string | null } | null;
    schedule: any | null;
    decodeToken: DecodeToken;
}

const ScheduleWrapper = ({ groups, schedule, decodeToken }: WrapperProps) => {
    const router = useRouter();
    const params = useSearchParams();
    const { data: profile } = useProfileQuery(decodeToken);

    useEffect(() => {
        if (profile?.academic_groups.length) {
            const group = profile.academic_groups[0].name.toUpperCase();
            router.push(`?group=${group}`);
        }
    }, [profile]);

    // if (schedule.error) {
    //     toast.error(schedule.error);
    // }
    return (
        <main className="overflow-x-hidden schedule-wrapper">
            {groups && groups.error && (
                <h2 className="text-center mt-10 font-bold">{groups.error}</h2>
            )}
            {groups && groups.data && <GroupSelect data={groups.data.results} />}

            {!schedule ||
                (schedule.error && (
                    <h2 className="text-center mt-10 font-bold">{schedule.error}</h2>
                ))}
            {schedule && schedule?.data && (
                <GroupSchedule
                    // groupName={schedule?.data?.group?.name}
                    groupName={params.get("group") || ""}
                    schedule={schedule?.data}
                />
            )}
        </main>
    );
};

export default ScheduleWrapper;
