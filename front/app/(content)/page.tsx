'use client'
import styles from "./page.module.css";
import {useEffect, useState} from "react";
import {Cafe, Criteria, DeleteCafe, FilterKey, Operation, SearchCafe} from "@/api/cafe";
import {useUserStore} from "@/context/user-store";
import mark from "@/public/mark.svg";
import cross from "@/public/cross.svg";
import cafe_svg from "@/public/cafe.svg";
import {Game, GetGames} from "@/api/game";
import Link from "next/link";
import edit_icon from "@/public/edit.svg";
import delete_icon from "@/public/trash.svg";
import {loadAllPages} from "@/api/api";
import {Food, GetFoods} from "@/api/food";
import {GetHookahs, Hookah} from "@/api/hookah";
import {Drink, GetDrinks} from "@/api/drinks";
import {DrinkItem, FoodItem, HookahItem} from "@/app/components/tooltip";

const NUM_FILTERS = [Operation.EQUAL, Operation.NOT_EQUAL, Operation.GREATER_THAN, Operation.LESS_THAN, Operation.GREATER_THAN_EQUAL, Operation.LESS_THAN_EQUAL];
const STR_FILTERS = [Operation.STR_CONTAINS, Operation.STR_DOES_NOT_CONTAIN, Operation.STR_EQUAL, Operation.STR_NOT_EQUAL, Operation.BEGINS_WITH, Operation.ENDS_WITH, Operation.DOES_NOT_BEGIN_WITH, Operation.DOES_NOT_END_WITH];
export default function Home() {
    const [cafes, setCafes] = useState<(Cafe & { games?: Game[], food?: Food[], hookahs?: Hookah[], drinks?: Drink[] })[]>([]);
    const inited = useUserStore((state) => state.inited);
    const [filters, setFilters] = useState<SearchCafe>({
        searchCriteriaList: [],
        dataOption: 'ALL',
    });
    const [filterKey, setFilterKey] = useState<FilterKey>(FilterKey.ID);

    // useEffect(() => {
    //     if (!inited) return;
    //     loadAllPages(GetCafes, 0).then(cafes => {
    //         setCafes(cafes);
    //         cafes.forEach(e => {
    //             loadAllPages(GetGames, e.id)
    //                 .then(games => {
    //                     if (games)
    //                         setCafes(old => old.map(c => c.id === e.id ? {...c, games} : c));
    //                 }).catch(console.warn)
    //         })
    //     });
    // }, [inited]);

    useEffect(() => {
        if (!inited) return;
        // @ts-ignore
        loadAllPages(SearchCafe, filters).then(cafes => {
            setCafes(cafes);
            cafes.forEach(e => {
                loadAllPages(GetGames, e.id)
                    .then(games => {
                        if (games)
                            setCafes(old => old.map(c => c.id === e.id ? {...c, games} : c));
                    }).catch(console.warn)
                loadAllPages(GetFoods, e.id)
                    .then(food => {
                        if (food)
                            setCafes(old => old.map(c => c.id === e.id ? {...c, food} : c));
                    }).catch(console.warn)
                loadAllPages(GetDrinks, e.id)
                    .then(drinks => {
                        if (drinks)
                            setCafes(old => old.map(c => c.id === e.id ? {...c, drinks} : c));
                    }).catch(console.warn)
                loadAllPages(GetHookahs, e.id)
                    .then(hookahs => {
                        if (hookahs)
                            setCafes(old => old.map(c => c.id === e.id ? {...c, hookahs} : c));
                    }).catch(console.warn)
            })
        });
    }, [inited, filters]);

    return (
        <main className={styles.main}>
            <h1>Поиск антикафе</h1>
            <div className={styles.main__filters}>
                <form className={styles.main__filters_form}
                      onSubmit={e => {
                          e.preventDefault();
                          const crit: Criteria = Object.fromEntries(new FormData(e.currentTarget)) as unknown as Criteria;
                          if (crit.filterKey === FilterKey.ID)
                              crit.value = +crit.value;
                          if (crit.filterKey === FilterKey.ALCOHOL_PERMISSION || crit.filterKey === FilterKey.SMOKING_PERMISSION)
                              crit.value = crit.value === 'on';
                          setFilters({
                              searchCriteriaList: filters.searchCriteriaList.concat(crit),
                              dataOption: filters.dataOption,
                          });
                          e.currentTarget.reset();
                      }}
                >
                    <select name='filterKey' onChange={e => {
                        console.log(e.currentTarget.value)
                        setFilterKey(e.currentTarget.value as FilterKey);
                    }} value={filterKey}>{Object.keys(FilterKey).map(e =>
                        <option value={FilterKey[e as keyof typeof FilterKey]} key={e}>{e}</option>
                    )}</select>

                    <select name='operation'>
                        {(filterKey === FilterKey.ID ? NUM_FILTERS :
                            (filterKey === FilterKey.ALCOHOL_PERMISSION
                                || filterKey === FilterKey.SMOKING_PERMISSION)
                                ? [Operation.EQUAL, Operation.NOT_EQUAL] : STR_FILTERS).map(e =>
                            <option value={e} key={e}>
                                {Object.keys(Operation).find(key => Operation[key as keyof typeof Operation] === e)}</option>
                        )}</select>

                    <label className={styles.label}><input type={
                        (filterKey === FilterKey.ID ? 'number' :
                            (filterKey === FilterKey.ALCOHOL_PERMISSION
                                || filterKey === FilterKey.SMOKING_PERMISSION) ? 'checkbox' : 'text')
                    } name='value'
                                                           required={filterKey !== FilterKey.SMOKING_PERMISSION && filterKey !== FilterKey.ALCOHOL_PERMISSION}/>
                    </label>

                    <button>Добавить фильтр</button>
                </form>
                <div className={styles.main__filters_panel}>
                    {filters.searchCriteriaList.map((e, i) =>
                        <div className={styles.main__filters_panel_item} key={i}>
                            <p>{e.filterKey}</p>
                            <p>{Object.keys(Operation).find(key => Operation[key as keyof typeof Operation] === e.operation)}</p>
                            <p>{e.value.toString()}</p>
                            <img src={cross.src} alt="cross" onClick={() => setFilters({
                                searchCriteriaList: filters.searchCriteriaList.filter(f => f !== e),
                                dataOption: filters.dataOption,
                            })
                            }/>
                        </div>)}
                </div>
            </div>
            <div className={styles.cards}>
                {cafes.map(e =>
                    <CafeCard key={e.id} cafe={e}/>
                )}
            </div>
        </main>
    );
}

function CafeCard({cafe}: { cafe: Cafe & { games?: Game[], food?: Food[], hookahs?: Hookah[], drinks?: Drink[] } }) {
    const [opened, setOpened] = useState(false);
    const [deleted, setDeleted] = useState(false);

    return (
        !deleted && <div className={styles.cafe_card}>
            {useUserStore.getState().isAdmin &&
                <Link href={'/cafe/edit/' + cafe.id} className={styles.cafe_card__edit} style={{right: '60px'}}><img
                    src={edit_icon.src}/></Link>}
            {useUserStore.getState().isAdmin &&
                <div className={styles.cafe_card__edit} style={{cursor: 'pointer'}}
                onClick={() => {
                    DeleteCafe(cafe.id);
                    setDeleted(true);
                }}><img
                    src={delete_icon.src}/></div>}
            <h3 className={styles.cafe_card__title}>{cafe.name}</h3>
            <div className={styles.cafe_card__content}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <img src={cafe.poster || cafe_svg.src} className={styles.cafe_card__image}/>
                    {opened && <>
                        <div style={{marginTop: '10px'}}>
                            <p className={styles.cafe_card__games_title}>Игры</p>
                            <div className={styles.cafe_card__games_content}>
                                {cafe?.games?.map(e =>
                                    <p key={e.id}>{e.name}</p>
                                )}
                            </div>
                        </div>
                        {cafe?.hookahs && cafe.hookahs.length > 0 && <div style={{marginTop: '10px'}}>
                            <p className={styles.cafe_card__games_title}>Кальяны</p>
                            <div className={styles.cafe_card__games_content}>
                                {cafe.hookahs.map((e, i) =>
                                    <div key={i} className={styles.lobby__game}>
                                        {e.tobacco}
                                        <HookahItem hookah={e}></HookahItem></div>
                                )}
                            </div>
                        </div>}
                    </>}
                </div>
                <div className={styles.cafe_card__info}>
                    <pre className={styles.cafe_card__address}>{cafe.address}</pre>
                    <pre>{cafe.workingHours}</pre>
                    <div>Алкоголь <img src={cafe.alcoholPermission ? mark.src : cross.src}/></div>
                    <div>Курение <img src={cafe.alcoholPermission ? mark.src : cross.src}/></div>
                    {/*<RatingBar rating={cafe.rating} size={20}/>*/}
                    <button onClick={() => setOpened(!opened)}>{opened ? "Скрыть" : "Подробнее"}</button>
                    {opened &&
                        <>
                            <p>{cafe.description}</p>
                            <a style={{display: 'contents'}} href={'/lobbies/' + cafe.id.toString()}>
                                <button style={{marginTop: 'auto'}}>Найти лобби</button>
                            </a>
                            <a style={{display: 'contents'}} href={'/lobbies/new/' + cafe.id.toString()}>
                                <button>Создать лобби</button>
                            </a>
                            {cafe?.drinks && cafe.drinks.length > 0  && <div style={{marginTop: '10px'}}>
                                <p className={styles.cafe_card__games_title}>Напитки</p>
                                <div className={styles.cafe_card__games_content}>
                                    {cafe.drinks.map((e, i) =>
                                        <div key={i} className={styles.lobby__game}>
                                            {e.name}
                                            <DrinkItem drink={e}></DrinkItem></div>
                                    )}
                                </div>
                            </div>}
                            {cafe?.food && cafe.food.length > 0 && <div style={{marginTop: '10px'}}>
                                <p className={styles.cafe_card__games_title}>Еда</p>
                                <div className={styles.cafe_card__games_content}>
                                    {cafe.food.map((e, i) =>
                                        <div key={i} className={styles.lobby__game}>
                                            {e.name}
                                            <FoodItem food={e}></FoodItem></div>
                                    )}
                                </div>
                            </div>}
                        </>}
                </div>
            </div>
        </div>
    )
}