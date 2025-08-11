import { useRouter } from 'next/navigation';
import axios from 'axios';
// Function for getting the current user
export const getCurrentUser = async () => {
    // Check for browser env first
    if (typeof window === 'undefined'){
        throw new Error("Cannot access localStorage on server");
    }
    // Obtain access token from local storage and check if it exists
    const accessToken = localStorage.getItem('access_token');
    console.log("Token:", localStorage.getItem('access_token')?.substring(0, 20) + '...');
    if (!accessToken){
        throw new Error("Access Token Not Found");
    }

    try{
        // Fetch user from backend
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getUser/`, 
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': "application/json",
                },
            }
        )
        
        // If the access token has expired 
        if (response.status === 401){
            // Get a new one, or the session has expired
            const refreshToken = await getRefreshToken();
            if (refreshToken){
                return await getCurrentUser();
            }
            else{
                throw new Error("Session Expired")
            }
        }

        return await response.data;
    }
    catch (error){
        console.error("Error Fetching User Data");
        throw error;
    }
}

export const getRefreshToken = async() => {
    if (typeof window === 'undefined'){
        return false;
    }
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken){
        throw new Error ("Error Fetching Refresh Token");
    }

    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/token/refresh/`, 
            { refresh: refreshToken}
        )

        if (!response.ok){
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return false;
        }

        const data = await response.json()
        localStorage.setItem('access_token', data.access)
        return true;
    }
    catch(error){
        console.error("Error Fetching Data");
        return false;
    }
}

export const isAuthenticated = () => {
    if (typeof window !== 'undefined'){
        return !!localStorage.getItem('access_token');
    }
    return false;
}

export const logout = () => {
    if (typeof window === 'undefined'){
        return;
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
}