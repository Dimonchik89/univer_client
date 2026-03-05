"use client";

import { useEffect } from "react";
import { DecodeToken } from "../../../types/user";
import { useProfileQuery } from "../../../utils/query/profile-query";
import GroupSchedule from "../../Group/GroupSchedule/GroupSchedule";
import GroupSelect from "../../Group/GroupSelect/GroupSelect";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "../../Loader/Loader";
import { groupQuery } from "../../../utils/query/group-query";
import { scheduleGroupQuery } from "../../../utils/query/schedule-group-query";

interface WrapperProps {
    // groups: { data: { results: Group[] } | null; error: string | null } | null;
    // schedule: any | null;
    decodeToken: DecodeToken;
}

const ScheduleWrapper = ({ decodeToken }: WrapperProps) => {
    const router = useRouter();
    const params = useSearchParams();
    const { data: profile } = useProfileQuery(decodeToken);

    const currentGroup = params.get("group") || "";
    const { data: groups, isLoading, error } = groupQuery();

    const {
        data: schedule,
        isLoading: isScheduleLoading,
        error: scheduleError,
    } = scheduleGroupQuery({ currentGroup });

    useEffect(() => {
        if (profile?.academic_groups.length) {
            const group = profile.academic_groups[0].name.toUpperCase();
            router.push(`?group=${group}`);
        }
    }, [profile]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <main className="overflow-x-hidden schedule-wrapper">
            {error && <h2 className="text-center mt-10 font-bold">{error.message}</h2>}
            {groups && <GroupSelect data={groups.results} />}

            {isScheduleLoading && <Loader />}
            {!scheduleError ||
                (schedule.error && (
                    <h2 className="text-center mt-10 font-bold">{scheduleError.message}</h2>
                ))}
            {schedule && (
                <GroupSchedule
                    // groupName={schedule?.data?.group?.name}
                    groupName={params.get("group") || ""}
                    schedule={schedule}
                />
            )}
        </main>
    );
};

export default ScheduleWrapper;
