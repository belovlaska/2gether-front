'use client'
import styles from './page.module.css'
import {Cafe, CreateCafe} from "@/api/cafe";
import {useRouter} from "next/navigation";

export default function Page() {
    const router = useRouter();

    return (
        <form className={styles.main}
              onSubmit={e => {
                  e.preventDefault();
                  const payload: Partial<Cafe> & any = Object.fromEntries(new FormData(e.currentTarget));
                  payload.alcoholPermission = payload?.alcoholPermission === 'on';
                  payload.smokingPermission = payload?.smokingPermission === 'on';
                  CreateCafe(payload)
                      .then(cafe => {
                          if (cafe)
                              router.push("/cafe/edit/" + cafe.id);
                      })
              }}
        >
            <h1>Добавление антикафе</h1>
            <div className={styles.lobby}>
                <div className={styles.lobby__datetime}>
                    <label className={styles.label}>
                        <input type="text" name="name"
                               required
                               placeholder=' '/>
                        <p
                            className={styles.label__placeholder}>Название</p>
                    </label>
                    <label className={styles.label}>
                        <input type="text" name="address"
                               required
                               placeholder=' '/>
                        <p
                            className={styles.label__placeholder}>Адрес</p>
                    </label>
                    <label className={styles.label}>
                        <input type="text" name="workingHours"
                               required
                               placeholder=' '/>
                        <p
                            className={styles.label__placeholder}>График работы</p>
                    </label>
                </div>
                <div>
                    <h3 className={styles.cafe_card__title}>О нас</h3>
                    <textarea className={styles.lobby__description} contentEditable={true}
                              placeholder="Расскажите об антикафе..." name="description"
                              rows={5}
                    >
                    </textarea>
                </div>
                <div className={styles.lobby__confirm}>
                    <h3 className={styles.cafe_card__title}>Курение и алкоголь</h3>
                    <div className={styles.lobby__settings}>
                        <label>Алкоголь<input type='checkbox' name="alcoholPermission"/></label>
                        <label>Курение<input type='checkbox' name="smokingPermission"/></label>
                    </div>
                    <button>Создать антикафе</button>
                </div>
            </div>
        </form>
    )
}