'use client'
import {Cafe, GetCafe} from "@/api/cafe";
import {useEffect, useState} from "react";
import {useUserStore} from "@/context/user-store";
import styles from './page.module.css'
import mark from "@/public/mark.svg";
import cross from "@/public/cross.svg";
import {CreateLobby, Lobby} from "@/api/lobby";
import {Game, GetGames} from "@/api/game";
import {useRouter} from "next/navigation";
import {loadAllPages} from "@/api/api";


export default function Page({params}: { params: Promise<{ id: string }> }) {
    const [cafe, setCafe] = useState<Cafe | null>(null);
    const [games, setGames] = useState<Game[] | null>([]);
    const inited = useUserStore((state) => state.inited);

    const router = useRouter();

    useEffect(() => {
        if(!inited) return;
        params.then(({id}) => GetCafe(+id).then(setCafe));
        params.then(({id}) => loadAllPages(GetGames, +id).then(setGames));
    }, [inited]);

    return (
        <form className={styles.main}
              onSubmit={e => {
                  e.preventDefault();
                  const payload: Partial<Lobby> | any = Object.fromEntries(new FormData(e.currentTarget));
                  payload.maxParticipants = +payload.maxParticipants;
                  payload.date = payload.date + ' ' + payload.time + ':00';
                  delete payload.time;
                  params.then(({id}) => CreateLobby(+id, payload)
                      .then(lobby => {
                          if(lobby)
                              router.push("/lobbies");
                      })
                  )
              }}
        >
            <h1>Создание лобби в<br/>{cafe?.name}</h1>
            <div className={styles.cafe_info}>
                <pre>{cafe?.workingHours}</pre>
                <div className={styles.cafe_info}>
                    <div>Алкоголь <img src={cafe?.alcoholPermission ? mark.src : cross.src}/></div>
                    <div>Курение <img src={cafe?.smokingPermission ? mark.src : cross.src}/></div>
                </div>
            </div>
            <div className={styles.lobby}>
                <div className={styles.lobby__datetime}>
                    <label>Выберите дату <input type="date" name='date' required
                                                min={new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0]}/></label>
                    <label>Выберите время <input type="time" name='time' required min="08:00" max="23:00"/></label>
                    <label>Количество человек <input type="number" min={1} required step={1}
                                                     name='maxParticipants'/></label>
                    <textarea name='description' placeholder='Описание...' required></textarea>
                </div>
                <div>
                    <h3 className={styles.cafe_card__title}>Игры</h3>
                    <div className={styles.lobby__games}>
                        {games && games.map((e, i) =>
                            <label key={i} className={styles.lobby__game}><input type='checkbox' readOnly={true} checked={true}/>{e.name}</label>
                        )}
                    </div>
                </div>
                <div className={styles.lobby__confirm}>
                    <button>Создать лобби</button>
                </div>
            </div>
        </form>
    )
}
