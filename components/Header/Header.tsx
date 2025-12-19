"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignoutMutation } from "../../utils/mutation/signout-mutation";
import { navigationLinks } from "../../common/navigationLinks";
import { useProfileFromCache } from "../../utils/query/profile-query-cache";
import { UserProfile } from "../../types/user";

interface HeaderProps {
    profile: UserProfile | undefined;
}

const Header = ({ profile }: HeaderProps) => {
    const router = useRouter();
    const isAdministrator = profile?.roles.some((item) => item.slug === "administrator");

    // const profile = useProfileFromCache();
    const { mutate, data, isSuccess: isSignoutSuccess } = useSignoutMutation();
    const handleSignOut = () => {
        mutate();
        router.push("/login");
    };

    return (
        <nav className="bg-green-600 text-white p-4 flex gap-6">
            <div className="w-full flex justify-between">
                <div className="flex gap-6">
                    {profile &&
                        navigationLinks.map(({ name, path }) => {
                            return (
                                <Link key={name} href={path}>
                                    {name}
                                </Link>
                            );
                        })}
                </div>

                {profile ? (
                    <div className="flex gap-3">
                        {isAdministrator && <Link href="/admin">Admin page</Link>}
                        <button onClick={handleSignOut}>Вийти</button>
                    </div>
                ) : (
                    <div className="place-self-end">
                        <Link href="/login">Увійти</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;
