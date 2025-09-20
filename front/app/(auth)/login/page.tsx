'use client'
import Spinner from "@/app/components/spinner";
import {useEffect, useState} from "react";
import styles from "./page.module.css";
import {Message} from "@/api/api";
import MessageComponent from "@/app/components/message";
import {Login} from "@/api/auth";
import Link from "next/link";
import {useUserStore} from "@/context/user-store";
import {useRouter} from "next/navigation";
import {EmailValidator, NameValidator, PasswordValidator} from "@/app/(auth)/login/validators";


export default function LoginPage() {
    const [response, setResponse] = useState<Message | null>(null)
    const [requestSent, setRequestSent] = useState<boolean>(false);
    const router = useRouter();
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        if (response) setRequestSent(false);
    }, [response]);

    useEffect(() => {
        if (user) router.push("/");
    }, [user]);

    return (
        <main style={{height: '-webkit-fill-available', display: 'flex', flexDirection: "column"}}>
            <h1 className={styles.title}>Авторизация</h1>
            <form className={styles.form} onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                setResponse(null);
                setRequestSent(true);
                Login(formData.get("username") as string, formData.get("password") as string)
                    .then(setResponse);
            }}>
                <label className={styles.label}>
                    <input type="text" name="username"
                           required onInput={NameValidator}
                           placeholder=' '
                           autoComplete="email"/>
                    <p
                        className={styles.label__placeholder}>Логин</p>
                </label>
                <label className={styles.label}>
                    <input type="password" name="password" minLength={6} maxLength={127}
                           required placeholder=' ' onInput={PasswordValidator}
                           autoComplete="current-password"/>
                    <p className={styles.label__placeholder}>Пароль</p>
                </label>
                <MessageComponent message={response} onlyError={true}/>
                <div className={styles.buttons}>
                    <button disabled={requestSent}>{requestSent &&
                        <Spinner size={30} style={{margin: "-11px 0 -11px -32px", paddingRight: "32px"}}/>}Войти
                    </button>
                </div>
                <Link href="/register" className={styles.register_link}>Регистрация</Link>
            </form>
        </main>
    )
}
