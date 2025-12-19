import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

export const getDecodedUserFromCookies = async () => {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('access_token')?.value;
	const refreshToken = cookieStore.get("refresh_token")?.value;

	let decode: { id: string } | null = null
	let tokenDecoded = accessToken || refreshToken || null;

	if(!tokenDecoded) {
		return null;
	}

	try {
		decode = jwtDecode<{ id: string }>(tokenDecoded);
		return decode;
	} catch(error) {
		console.log("JWT decode Error", error);
		return null;
	}
}