'use client'

import {useRouter, useSearchParams} from "next/navigation";
import Spinner from "@/app/components/spinner";
import {useEffect, useState} from "react";
import {ConfirmEmail} from "@/api/auth";

export default function Page(){
    const query = useSearchParams();
    const token = query.get('confirmation_token');
    const router = useRouter();
    const [text, setText] = useState<string>('Ожидайте подтверждения почты...');

    if(!token)
        router.push('/');

    useEffect(() => {
        if(!token) return;
        ConfirmEmail(token)
            .then(message => {
                setText(message.message + '\n' + "Сейчас перенаправлю вас на главную страницу...");
                setTimeout(() => router.push('/'), message.isError ? 3000 : 1000);
            })
    }, []);

    return (
        <main style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <h1 style={{whiteSpace: 'pre-wrap', textAlign: 'center'}}>{text}</h1>
            <Spinner size={120}/>
        </main>
    )
}