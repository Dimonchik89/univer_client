"use client";
import dynamic from "next/dynamic";

const AdminApp = dynamic(() => import("../../components/Admin/AdminApp/AdminApp"), {
    ssr: false,
});

export default function AdminPage() {
    return <AdminApp />;
}
