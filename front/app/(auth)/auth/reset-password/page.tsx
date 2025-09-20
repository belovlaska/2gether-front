'use client'
import {useRouter, useSearchParams} from "next/navigation";
import Spinner from "@/app/components/spinner";
import {useEffect, useRef, useState} from "react";
import MessageComponent from "@/app/components/message";
import styles from "@/app/(auth)/login/page.module.css";
import {Message} from "@/api/api";
import {PasswordValidator} from "@/app/(auth)/login/validators";
import {ResetPass} from "@/api/auth";

export default function Page() {
    const query = useSearchParams();
    const token = query.get('password_reset_token');
    const router = useRouter();
    const [response, setResponse] = useState<Message | null>(null)
    const [requestSent, setRequestSent] = useState<boolean>(false);

    const pass1Ref = useRef<HTMLInputElement>(null);
    const pass2Ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (response) setRequestSent(false);
        if (response?.isError == false) router.push('/');
    }, [response]);

    if (!token)
        router.push('/');

    return (
        <form className={styles.form} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            margin: '0'
        }}
              onSubmit={e => {
                  e.preventDefault();
                  setResponse(null);
                  setRequestSent(true);
                  ResetPass(token as string, pass1Ref.current?.value as string)
                      .then(setResponse);
              }}
        >
            <h1 style={{whiteSpace: 'pre-wrap', textAlign: 'center'}}>Сброс пароля</h1>
            <label className={styles.label}>
                <input type='password' ref={pass1Ref} name="password" minLength={6} maxLength={127}
                       required placeholder=' ' onInput={PasswordValidator}/>
                <p
                    className={styles.label__placeholder}>Новый пароль</p></label>
            <label className={styles.label}>
                <input type='password' ref={pass2Ref} minLength={6} maxLength={127}
                       required placeholder=' ' onInput={e => {
                    PasswordValidator(e);
                    if (e.currentTarget.reportValidity()) {
                        if (pass1Ref.current?.value == pass2Ref.current?.value)
                            pass2Ref.current?.setCustomValidity("");
                        else
                            pass2Ref.current?.setCustomValidity("Пароли не совпадают!");
                    }
                }}/><p
                className={styles.label__placeholder}>Повторите пароль</p></label>
            <MessageComponent message={response} onlyError={false}/>
            <div className={styles.buttons}>
                <button disabled={requestSent}>{requestSent &&
                    <Spinner size={30} style={{margin: "-11px 0 -11px -32px", paddingRight: "32px"}}/>}Войти
                </button>
            </div>
        </form>
    )
}