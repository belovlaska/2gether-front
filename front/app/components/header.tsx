'use client'
import {usePathname, useRouter} from "next/navigation";
import {useUserStore} from "@/context/user-store";
import {useEffect, useRef, useState} from "react";
import "./header.css";
import Link from "next/link";
import {Message} from "@/api/api";
import {ResetPassRequest} from "@/api/auth";

interface NavigationRoute {
    path: string;
    isAdmin: boolean;
}

const route = (path: string, isAdmin: boolean = false): NavigationRoute => {
    return {path: path, isAdmin: isAdmin};
};

export default function Header() {
    const [showComboBox, setShowComboBox] = useState(false);

    const path = usePathname();
    const isAdmin = useUserStore(state => state.isAdmin);
    const login = useUserStore(state => state.user?.username);

    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [response, setResponse] = useState<Message | null>(null)
    const [requestSent, setRequestSent] = useState<boolean>(false);
    useEffect(() => {
        if (response) setRequestSent(false);
        if (response?.isError == false) dialogRef.current?.close();
    }, [response]);


    const routes: { [key: string]: NavigationRoute } = {
        "Главная": route("/"),
        "Мои лобби": route("/lobbies"),
    }

    if (isAdmin)
        routes["Добавить антикафе"] = route("/cafe/new");
    if (path.startsWith('/lobbies/')) {
        if (path.startsWith('/lobbies/new/'))
            routes["Найти лобби"] = route("/lobbies/" + path.substring(13));
        else
            routes["Создать лобби"] = route("/lobbies/new/" + path.substring(9));
    }

    return (
        <header className="header">
            {Object.keys(routes).filter(e => !routes[e].isAdmin || routes[e].isAdmin == isAdmin).map((key, index) =>
                <Link className={"header-link" + (path == routes[key].path ? " disabled" : "")} href={routes[key].path}
                      key={index}>
                    {key}
                </Link>
            )}
            <div className='profile'>
                {showComboBox && <div className='combo-box'>
                    <button onClick={() => {
                        if (dialogRef.current) dialogRef.current.showModal();
                        ResetPassRequest();
                    }}>Сброс пароля
                    </button>
                    <button onClick={() => {
                        useUserStore.getState().Logout();
                        router.push('/login');
                    }}>Выйти
                    </button>
                </div>}
                <div onClick={() => setShowComboBox(!showComboBox)} style={{cursor: 'pointer'}}>
                    <svg width="25px" height="25px" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                            stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {login}
                </div>
            </div>
            <dialog ref={dialogRef}>
                <form method='dialog'>
                    <h3>Мы отправили ссылку для сброса пароля вам на почту</h3>
                    <button className='ok_button'>Понятно</button>
                </form>
            </dialog>
        </header>
    )
}