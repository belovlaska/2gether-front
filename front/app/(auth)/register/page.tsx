'use client'
import Spinner from "@/app/components/spinner";
import {useEffect, useState} from "react";
import styles from "./../login/page.module.css";
import {SignUp} from "@/api/auth";
import MessageComponent from "@/app/components/message";
import Link from "next/link";
import {useUserStore} from "@/context/user-store";
import {useRouter} from "next/navigation";
import {EmailValidator, NameValidator, PasswordValidator} from "@/app/(auth)/login/validators";
import {Message} from "@/api/api";

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
            <h1 className={styles.title}>Регистрация</h1>
            <form className={styles.form} onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                setResponse(null);
                setRequestSent(true);
                SignUp(formData.get("username") as string,
                    formData.get("email") as string,
                    formData.get("password") as string)
                    .then(setResponse);
            }}>
                <label className={styles.label}>
                    <input type="text" name="username" minLength={2} maxLength={127}
                           required onInput={NameValidator}
                           placeholder=' '
                           autoComplete="username"/>
                    <p
                        className={styles.label__placeholder}>Имя пользователя</p>
                </label>
                <label className={styles.label}>
                    <input type="text" name="email"
                           required onInput={EmailValidator}
                           placeholder=' '
                           autoComplete="email"/>
                    <p
                        className={styles.label__placeholder}>Почта</p>
                </label>
                <label className={styles.label}>
                    <input type="password" name="password" minLength={6} maxLength={127}
                           required placeholder=' ' onInput={PasswordValidator}
                           autoComplete="new-password"/>
                    <p
                        className={styles.label__placeholder}>Пароль</p>
                </label>
                <MessageComponent message={response}/>
                <div className={styles.buttons}>
                    <button disabled={requestSent}>{requestSent &&
                        <Spinner size={30} style={{margin: "-11px 0 -11px -32px", paddingRight: "32px"}}/>}Зарегистрироваться
                    </button>
                </div>
                <Link href="/login" className={styles.register_link}>Вход</Link>
            </form>
        </main>
    )
}
