"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Group } from "../../../types/schedule";

interface SelectProps {
    data: Group[];
}

const GroupSelect = ({ data }: SelectProps) => {
    const router = useRouter();
    const params = useSearchParams();
    const group = params.get("group") || "";

    return (
        <select
            value={group}
            className="group-select"
            onChange={async (e) => {
                router.push(`?group=${e.target.value}`);
            }}
        >
            {data.map((item: { name: string }) => (
                <option key={`group-${item.name}`} value={item.name}>
                    {item.name}
                </option>
            ))}
        </select>
    );
};

export default GroupSelect;
