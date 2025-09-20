'use client'
import {useEffect, useRef, useState} from "react";
import styles from './components.module.css';
import {AddFood, Food} from "@/api/food"; // Adjust the import path as necessary

const AddFoodDialog = ({cafeId, onClose, onFoodAdded}: { cafeId: number, onClose: () => void, onFoodAdded: (food: Food) => void }) => {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [cost, setCost] = useState<number | ''>('');
    const [isHot, setIsHot] = useState(false);
    const [isSpicy, setIsSpicy] = useState(false);
    const [error, setError] = useState('');
    const dialogRef = useRef<HTMLDialogElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate inputs
        if (!name || !ingredients || cost === '' || cost < 0) {
            setError('Please fill in all fields correctly.');
            return;
        }

        const food: Partial<Food> = {
            name,
            ingredients,
            cost: Number(cost),
            isHot,
            isSpicy,
        };

        const result = await AddFood(cafeId, food);
        if (result) {
            onFoodAdded(result); // Call the parent function to update the food list
            onClose(); // Close the dialog
        } else {
            setError('Failed to add food item. Please try again.');
        }
    };

    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    return (
        <dialog className={styles.dialog} ref={dialogRef}>
            <form onSubmit={handleSubmit}>
                <h2>Добавить Блюдо</h2>
                {error && <p className={styles.dialogError}>{error}</p>}
                    <label>
                        Название:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Ингредиенты:<br/>
                        <textarea
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Стоимость:
                        <input
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(+e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Горячее:
                        <input
                            type="checkbox"
                            checked={isHot}
                            onChange={(e) => setIsHot(e.target.checked)}
                        />
                    </label>
                    <label>
                        Острое:
                        <input
                            type="checkbox"
                            checked={isSpicy}
                            onChange={(e) => setIsSpicy(e.target.checked)}
                        />
                    </label>
                    <button type="submit">Добавить</button>
                    <button type="button" onClick={onClose}>Закрыть</button>
            </form>
        </dialog>
);
};

export default AddFoodDialog;
