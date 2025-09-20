'use client'
import {useEffect, useState} from "react";
import {useUserStore} from "@/context/user-store";
import styles from './page.module.css'
import mark from "@/public/mark.svg";
import cross from "@/public/cross.svg";
import {DeleteLobby, GetUserLobbies, JoinLobby, Lobby, UnjoinLobby} from "@/api/lobby";
import {loadAllPages} from "@/api/api";


export default function Page() {
    const [lobbies, setLobbies] = useState<Lobby[]>()
    const inited = useUserStore((state) => state.inited);
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        if (!inited || !user) return;
        loadAllPages(GetUserLobbies, user.id).then(setLobbies);
    }, [inited]);


    return (
        <main className={styles.main}>
            <h1>Ваши лобби</h1>
            <div className={styles.lobbies}>
                {lobbies?.map(e => <LobbyCard key={e.id} lobby={e}/>)}
            </div>
        </main>
    )
}

// Дата: Jan 10, 2024
// Время: с 10:00 am до 4:30 pm
// Игра: Диксит
// Алкоголь
// Курение

function LobbyCard({lobby}: { lobby: Lobby }) {
    const inLobby = lobby.participants.map(e=>e.id).includes(useUserStore((state) => state.user!.id));
    const [joined, setJoined] =
        useState(inLobby);
    const [deleted, setDeleted] = useState(false);

    const realParts = lobby.currentParticipants
        - (inLobby && !joined ? 1 : !inLobby && joined ? -1 : 0);

    return (
        !deleted ? <div className={styles.lobby_card}>
            <div className={styles.lobby_card__content}>
                <p>Дата: {new Date(lobby.date).toLocaleString()}</p>
                <p>Участники: {realParts}/{lobby.maxParticipants}</p>
                <p>Описание: {lobby.description}</p>
                <div>Алкоголь <img src={lobby?.cafe?.alcoholPermission ? mark.src : cross.src}/></div>
                <div>Курение <img src={lobby?.cafe?.smokingPermission ? mark.src : cross.src}/></div>
                <button
                    onClick={() => {
                        if (joined)
                            UnjoinLobby(lobby.id)
                                .then(() => {
                                    setJoined(false);
                                    if(lobby.currentParticipants == 1)
                                        setDeleted(true);
                                });
                        else
                            if(realParts < lobby.maxParticipants)
                                JoinLobby(lobby.id)
                                    .then(() => setJoined(true));
                    }}
                    className={styles.lobby_card__join + ' ' + (joined ? styles.lobby_card__join_disabled : '')}>
                    {joined ? 'Вы уже присоединились' : 'Присоединиться'}
                </button>
            </div>
        </div> : <></>
    )
}