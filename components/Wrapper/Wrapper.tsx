"use client";
import React, { useEffect, createContext } from "react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useProfileQuery } from "../../utils/query/profile-query";
import Loader from "../Loader/Loader";
import Header from "../Header/Header";
import BottomNav from "../BottomNav/BottomNav";
import { UserProfile } from "../../types/user";

export const ProfileContext = createContext<UserProfile | undefined>(undefined);

interface WrapperProps {
    children: React.ReactNode;
    decodeToken: { id: string } | null;
}

const Wrapper = ({ children, decodeToken }: WrapperProps) => {
    const { data: profile, isError, error, isLoading } = useProfileQuery(decodeToken);

    useEffect(() => {
        if (isError) {
            if (error instanceof AxiosError) {
                if (
                    error.response?.data.error === "Unauthorized" ||
                    error.response?.data.message === "Unauthorized"
                ) {
                    console.log("isError", isError, "Потрібно увійти до особистого кабінету");
                    toast.info("Потрібно увійти до особистого кабінету");
                } else {
                    toast.error("Щось пiшло не так. Спробуйте пiзнiше");
                }
            } else {
                toast.error("Щось пiшло не так. Спробуйте пiзнiше");
            }
        }
    }, [isError, error]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <ProfileContext value={profile}>
            <header className="hidden md:block">
                <Header profile={profile} />
            </header>
            {children}
            <footer className="block md:hidden fixed bottom-0 w-full">
                <BottomNav profile={profile} />
            </footer>
        </ProfileContext>
    );
};

export default Wrapper;
