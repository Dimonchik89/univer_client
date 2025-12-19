"use client";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useSignoutMutation } from "../../utils/mutation/signout-mutation";
import { useRouter } from "next/navigation";
import { navigationLinks } from "../../common/navigationLinks";
import { useProfileFromCache } from "../../utils/query/profile-query-cache";
import { usePathname } from "next/navigation";
import BottomNavItem from "./BottomNavItem";
import { UserProfile } from "../../types/user";

interface BottomNavProps {
    profile: UserProfile | undefined;
}

const BottomNav = ({ profile }: BottomNavProps) => {
    const router = useRouter();
    const pathname = usePathname();

    // const profile = useProfileFromCache();
    const { mutate, data, isSuccess: isSignoutSuccess } = useSignoutMutation();
    const handleSignOut = () => {
        mutate();
        router.push("/login");
    };

    return (
        <div className="bg-white border-t border-gray-200 flex justify-around p-2">
            {profile &&
                navigationLinks.map(({ Icon, name, path }) => (
                    <BottomNavItem
                        Icon={Icon}
                        name={name}
                        path={path}
                        key={path}
                        pathname={pathname}
                    />
                ))}
            {profile ? (
                <button
                    onClick={handleSignOut}
                    className="flex flex-col items-center text-green-600 cursor-pointer"
                >
                    <LogOut size={22} />
                    <span className="text-xs">Вийти</span>
                </button>
            ) : (
                <Link href="/login" className="flex flex-col items-center text-green-600">
                    <User size={22} />
                    <span className="text-xs">Увійти</span>
                </Link>
            )}
        </div>
    );
};

export default BottomNav;
