'use client'
import styles from '@/app/(content)/cafe/new/page.module.css'
import {useEffect, useRef, useState} from "react";
import {Cafe, CreateCafe, GetCafe, UpdateCafe, UploadPoster} from "@/api/cafe";
import {useUserStore} from "@/context/user-store";
import {AddGame, DeleteGame, Game, GetGames} from "@/api/game";
import cross from "@/public/cross.svg";
import {loadAllPages} from "@/api/api";
import {DeleteFood, Food, GetFoods} from "@/api/food";
import AddFoodDialog from "@/app/(content)/cafe/edit/[id]/add-food-dialog";
import {DeleteHookah, Hookah} from "@/api/hookah";
import AddHookahDialog from "@/app/(content)/cafe/edit/[id]/add-hookah-dialog";
import {DeleteDrink, Drink, GetDrinks} from "@/api/drinks";
import AddDrinkDialog from "@/app/(content)/cafe/edit/[id]/add-drink-dialog";
import Tooltip, {DrinkItem, FoodItem, HookahItem} from "@/app/components/tooltip";

export default function Page({params}: { params: Promise<{ id: string }> }) {
    const [cafe, setCafe] = useState<Cafe | null>(null);
    const inited = useUserStore((state) => state.inited);

    const newGameRef = useRef<HTMLInputElement>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [food, setFood] = useState<Food[]>([]);
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [hookahs, setHookahs] = useState<Hookah[]>([]);

    const [showFoodDialog, setShowFoodDialog] = useState(false);
    const [showHookahDialog, setShowHookahDialog] = useState(false);
    const [showDrinksDialog, setShowDrinksDialog] = useState(false);

    useEffect(() => {
        if (!inited) return;
        params.then(({id}) => GetCafe(+id).then(setCafe));
        params.then(({id}) => loadAllPages(GetGames, +id).then(setGames));
        params.then(({id}) => loadAllPages(GetFoods, +id).then(setFood));
        params.then(({id}) => loadAllPages(GetDrinks, +id).then(setDrinks));
    }, [inited]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let {name, value}: { name: string, value: any } = e.currentTarget;
        if (e.currentTarget.type === 'checkbox')
            value = (e.currentTarget as HTMLInputElement).checked;
        cafe && setCafe({...cafe, [name]: value});
    }

    return (
        <>
        <form className={styles.main}
              onSubmit={e => {
                  e.preventDefault();
                  cafe && params.then(({id}) => UpdateCafe(cafe, +id));
              }}
        >
            <h1>Изменение антикафе</h1>
            <div className={styles.lobby}>
                <div className={styles.lobby__datetime}>
                    <label className={styles.label}>
                        <input type="text" name="name" value={cafe?.name || ''}
                               required onChange={handleChange}
                               placeholder=' '/>
                        <p
                            className={styles.label__placeholder}>Название</p>
                    </label>
                    <label className={styles.label}>
                        <input type="text" name="address" value={cafe?.address || ''}
                               required onChange={handleChange}
                               placeholder=' '/>
                        <p
                            className={styles.label__placeholder}>Адрес</p>
                    </label>
                    <label className={styles.label}>
                        <input type="text" name="workingHours" value={cafe?.workingHours || ''}
                               required onChange={handleChange}
                               placeholder=' '/>
                        <p
                            className={styles.label__placeholder}>График работы</p>
                    </label>
                </div>
                <div>
                    <h3 className={styles.cafe_card__title}>О нас</h3>
                    <textarea className={styles.lobby__description} contentEditable={true}
                              placeholder="Расскажите об антикафе..." name="description"
                              rows={5} onChange={handleChange} value={cafe?.description || ''}
                    >
                    </textarea>
                </div>
                <div className={styles.lobby__confirm}>
                    <h3 className={styles.cafe_card__title}>Курение и алкоголь</h3>
                    <div className={styles.lobby__settings}>
                        <label>Алкоголь
                            <input type='checkbox' checked={cafe?.alcoholPermission || false}
                                   name="alcoholPermission" onChange={handleChange}/></label>
                        <label>Курение
                            <input type='checkbox' checked={cafe?.smokingPermission || false}
                                   name="smokingPermission" onChange={handleChange}/></label>
                    </div>
                    <button>Сохранить антикафе</button>
                </div>
                <div className={styles.cafe__image}>
                    <h3 className={styles.cafe_card__title}>Постер</h3>
                    <div>
                        <label style={cafe?.poster ? {
                            background: `center / cover no-repeat url(${cafe?.poster})`,
                        } : {}}>
                            <input type="file"
                                   onChange={() => {
                                       const file = (document.querySelector('input[type="file"]') as HTMLInputElement).files?.[0];
                                       if (!file) return;
                                       params.then(({id}) =>
                                           UploadPoster(+id, file)
                                               .then(cafe => {
                                                   cafe && setCafe(cafe);
                                               })
                                       );
                                   }} accept='.jpg, .png, .jpeg'/>
                            {!cafe?.poster && <svg width="60" height="60" viewBox="0 0 60 60" fill="none"
                                                   xmlns="http://www.w3.org/2000/svg">
                                <circle cx="30" cy="30" r="30" fill="white"/>
                                <path
                                    d="M14.9747 27.7352L27.7351 27.7349L27.7353 15.0407C27.7263 14.7513 27.7758 14.463 27.8809 14.1932C27.986 13.9234 28.1445 13.6775 28.3469 13.4705C28.7853 13.0321 29.3799 12.7858 29.9998 12.7858C30.6198 12.7858 31.2144 13.032 31.6527 13.4704C31.8592 13.6692 32.0229 13.9081 32.1338 14.1724C32.2446 14.4367 32.3003 14.7209 32.2973 15.0076L32.2144 27.7844L45.0739 27.7842C45.6128 27.7782 46.1335 27.9794 46.5284 28.3461C46.9668 28.7845 47.2131 29.379 47.2131 29.999C47.213 30.6189 46.9668 31.2135 46.5284 31.6519C46.3265 31.8713 46.0811 32.0463 45.8079 32.1658C45.5348 32.2853 45.2397 32.3467 44.9416 32.3461L32.2639 32.2638L32.2636 44.991C32.2682 45.275 32.2165 45.557 32.1115 45.8208C32.0066 46.0846 31.8504 46.3251 31.652 46.5282C31.2136 46.9666 30.6191 47.2129 29.9991 47.2129C29.3792 47.2129 28.7846 46.9667 28.3462 46.5283C28.1397 46.3295 27.976 46.0906 27.8652 45.8263C27.7544 45.562 27.6987 45.2778 27.7016 44.9911L27.7846 32.2143L14.925 32.2145C14.3861 32.2205 13.8655 32.0193 13.4705 31.6526C13.0321 31.2142 12.7859 30.6197 12.7859 29.9997C12.7859 29.3798 13.0322 28.7852 13.4706 28.3468C13.8722 27.9551 14.4127 27.7352 14.9747 27.7352Z"
                                    fill="#9E00FF"/>
                            </svg>}
                        </label>
                    </div>
                </div>
                <div>
                    <h3 className={styles.cafe_card__title}>Игры</h3>
                    <div className={styles.lobby__games}>
                        <label className={styles.label}>
                            <input type="text" ref={newGameRef}
                                   placeholder=' '/>
                            <p
                                className={styles.label__placeholder}>Название игры</p>
                        </label>
                        <button onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!newGameRef.current) return;
                            const game = newGameRef.current.value;
                            params.then(({id}) =>
                                AddGame(+id, {name: game})
                                    .then(game => game && setGames([...games, game]))
                            );
                        }}>Добавить игру
                        </button>
                        {games && games.map((e, i) =>
                            <label key={i} className={styles.lobby__game} onClick={() => {
                                DeleteGame(e.id)
                                    .then(() => {
                                        setGames(games.filter(game => game.id !== e.id))
                                    })
                            }}><img src={cross.src}/>{e.name}</label>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className={styles.cafe_card__title}>Еда</h3>
                    <div className={styles.lobby__games} style={{gridTemplateColumns: '1fr'}}>
                        <button onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowFoodDialog(true);
                        }}>Добавить блюдо
                        </button>
                        {food && food.map((e, i) =>
                            <label key={i} className={styles.lobby__game} onClick={() => {
                                DeleteFood(e.id)
                                    .then(() => {
                                        setFood(food.filter(f => f.id !== e.id))
                                    })
                            }}><img src={cross.src}/>{e.name}<FoodItem food={e}></FoodItem></label>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className={styles.cafe_card__title}>Напитки</h3>
                    <div className={styles.lobby__games}  style={{gridTemplateColumns: '1fr'}}>
                        <button onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowDrinksDialog(true);
                        }}>Добавить напиток
                        </button>
                        {drinks && drinks.map((e, i) =>
                            <label key={i} className={styles.lobby__game} onClick={() => {
                                DeleteDrink(e.id) // Assuming you have a DeleteDrink function
                                    .then(() => {
                                        setDrinks(drinks.filter(d => d.id !== e.id))
                                    })
                            }}><img src={cross.src}/>{e.name}<DrinkItem drink={e}></DrinkItem></label>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className={styles.cafe_card__title}>Кальян</h3>
                    <div className={styles.lobby__games}>
                        <button onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowHookahDialog(true);
                        }}>Добавить кальян
                        </button>
                        {hookahs && hookahs.map((e, i) =>
                            <label key={i} className={styles.lobby__game} onClick={() => {
                                DeleteHookah(e.id)
                                    .then(() => {
                                        setHookahs(hookahs.filter(h => h.id !== e.id))
                                    })
                            }}><img src={cross.src}/>{e.tobacco}<HookahItem hookah={e}></HookahItem></label>
                        )}
                    </div>
                </div>

            </div>
        </form>
            {/* Render the AddFoodDialog conditionally */}
            {showFoodDialog && (
                <AddFoodDialog
                    cafeId={cafe?.id || 0} // Pass the cafe ID
                    onClose={() => setShowFoodDialog(false)} // Close handler
                    onFoodAdded={(newFood: Food) => setFood([...food, newFood])} // Callback to update food list
                />
            )}

            {showHookahDialog && (
                <AddHookahDialog
                    cafeId={cafe?.id || 0} // Pass the cafe ID
                    onClose={() => setShowHookahDialog(false)} // Close handler
                    onHookahAdded={(newHookah: Hookah) => setHookahs([...hookahs, newHookah])} // Callback to update food list
                />
            )}

            {showDrinksDialog && (
                <AddDrinkDialog
                    cafeId={cafe?.id || 0} // Pass the cafe ID
                    onClose={() => setShowDrinksDialog(false)} // Close handler
                    onDrinkAdded={(newDrink: Drink) => setDrinks([...drinks, newDrink])} // Callback to update food list
                />
            )}
        </>
    )
}