'use client';
import { useEffect, useRef, useState } from "react";
import styles from './components.module.css';
import { AddDrink, Drink } from "@/api/drinks"; // Adjust the import path as necessary

interface AddDrinkDialogProps {
    cafeId: number;
    onClose: () => void;
    onDrinkAdded: (drink: Drink) => void;
}

const AddDrinkDialog = ({ cafeId, onClose, onDrinkAdded }: AddDrinkDialogProps) => {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [cost, setCost] = useState<number | ''>('');
    const [isAlcoholic, setIsAlcoholic] = useState(false);
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

        const drink: Partial<Drink> = {
            name,
            ingredients,
            cost: Number(cost),
            isAlcoholic,
        };

        const result = await AddDrink(cafeId, drink);
        if (result) {
            onDrinkAdded(result); // Update parent state with the new drink
            onClose(); // Close the dialog
        } else {
            setError('Failed to add drink item. Please try again.');
        }
    };

    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    return (
        <dialog ref={dialogRef} className={styles.dialog}>
            <form onSubmit={handleSubmit}>
                <h2>Добавить Напиток</h2>
                {error && <p className={styles.error}>{error}</p>}

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
                    Ингредиенты:
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
                        onChange={(e) => setCost(e.target.value === '' ? '' : +e.target.value)}
                        required
                    />
                </label>

                <label>
                    Алкоголь:
                    <input
                        type="checkbox"
                        checked={isAlcoholic}
                        onChange={(e) => setIsAlcoholic(e.target.checked)}
                    />
                </label>

                <button type="submit">Добавить</button>
                <button type="button" onClick={onClose}>Закрыть</button>
            </form>
        </dialog>
    );
};

export default AddDrinkDialog;
