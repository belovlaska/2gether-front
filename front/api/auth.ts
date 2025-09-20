import axios, {AxiosError} from "axios";
import {useUserStore} from "@/context/user-store";
import {Message} from "@/app/components/message";
import {api} from "@/api/api";


export async function Login(login: string, password: string): Promise<Message> {
    try {
        const res = await api.post('/auth/sign-in', {
            username: login,
            password: password
        })
        useUserStore.getState().Login(res.data.user, res.data.accessToken, res.data.user.roles.includes("ROLE_ADMIN"), res.data.refreshToken);
        return {isError: false, message: 'Успех!'};
    } catch (e: any) {
        const message: any = ((e as AxiosError)?.response?.data as string) || (e as AxiosError)?.message;
        if (message.errors && message.errors.length > 0) {
            return {isError: true, message: message.errors[0]};
        }
        return {isError: true, message: JSON.stringify(message)};
    }
}

export async function SignUp(username: string, login: string, password: string): Promise<Message> {
    try {
        const res = await api.post('/auth/sign-up', {
            username: username,
            email: login,
            password: password
        })
        useUserStore.getState().Login(res.data.user, res.data.accessToken, res.data.user.roles.includes("ROLE_ADMIN"), res.data.refreshToken);
        return {isError: false, message: 'Успех!'};
    } catch (e: any) {
        const message: any = ((e as AxiosError)?.response?.data as string) || (e as AxiosError)?.message;
        if ((message.errors && message.errors.length > 0) || message.message) {
            return {isError: true, message: message.message + '\t\n' + message.errors[0]};
        }
        return {isError: true, message: JSON.stringify(message)};
    }
}

export async function RefreshToken(refreshToken: string): Promise<{accessToken: string, refreshToken: string} | null> {
    try {
        const res = await api.post('/auth/refresh', {
            refreshToken: refreshToken
        })
        return res.data;
    } catch (e: any) {
        const message: any = ((e as AxiosError)?.response?.data as string) || (e as AxiosError)?.message;
        console.warn(message, e);
        return null;
    }
}

export async function ConfirmEmail(code: string): Promise<Message> {
    try {
        const res = await api.post('/auth/confirm', {
            verificationToken: code,
        })
        useUserStore.getState().Login(res.data.user, res.data.accessToken, res.data.user.roles.includes("ROLE_ADMIN"), res.data.refreshToken);
        return {isError: false, message: 'Успех!'};
    } catch (e: any) {
        const message: any = ((e as AxiosError)?.response?.data as string) || (e as AxiosError)?.message;
        if ((message.errors && message.errors.length > 0) || message.message) {
            return {isError: true, message: message.message + '\t\n' + message.errors[0]};
        }
        return {isError: true, message: JSON.stringify(message)};
    }
}

export async function ResetPassRequest(){
    try {
        await api.post('/auth/request-password-reset', {
            email: useUserStore.getState().user?.email
        });
    } catch (e: any) {
    }
}

export async function ResetPass(code: string, password: string): Promise<Message>{
    try {
        const res =await api.post('/auth/reset-password', {
            passwordResetToken: code,
            password: password
        });
        return {isError: false, message: 'Успех!'};
    } catch (e: any) {
        const message: any = ((e as AxiosError)?.response?.data as string) || (e as AxiosError)?.message;
        if ((message.errors && message.errors.length > 0) || message.message) {
            return {isError: true, message: message.message + '\t\n' + message.errors[0]};
        }
        return {isError: true, message: JSON.stringify(message)};
    }
}