import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        // Настройка прокси (для работы куки в режиме разработки при production удалить или сменить http://localhost:3005 на url нашего сервера)
        return [
            {
                source: "/api/:path*",
                destination: "https://0e20cc67fcdb.ngrok-free.app/api/:path*", // 💡 NestJS адрес
            },
        ];
    },
};

export default nextConfig;
