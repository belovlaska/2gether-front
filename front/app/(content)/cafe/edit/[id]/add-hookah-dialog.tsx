'use client'
import { useEffect, useRef, useState } from "react";
import styles from './components.module.css';
import { AddHookah, Hookah } from "@/api/hookah"; // Adjust the import path as necessary

const AddHookahDialog = ({ cafeId, onClose, onHookahAdded }: { cafeId: number, onClose: () => void, onHookahAdded: (hookah: Hookah) => void }) => {
// Define state for each hookah field
    const [tobacco, setTobacco] = useState('');
    const [strength, setStrength] = useState<number | ''>('');
    const [cost, setCost] = useState<number | ''>('');
    const [taste, setTaste] = useState('');
    const [error, setError] = useState('');
    const dialogRef = useRef<HTMLDialogElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate inputs (for required fields, ensuring numerical values are valid)
        if (!tobacco || strength === '' || cost === '' || cost < 0 || !taste) {
            setError('Please fill in all fields correctly.');
            return;
        }

        const hookah: Partial<Hookah> = {
            tobacco,
            strength: Number(strength),
            cost: Number(cost),
            taste,
        };

        // Pass the hookah data along with the cafe id
        const result = await AddHookah(cafeId, hookah);
        if (result) {
            onHookahAdded(result); // Notify the parent component about the new hookah
            onClose(); // Close the dialog
        } else {
            setError('Failed to add hookah. Please try again.');
        }
    };

    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    return (
        <dialog className={styles.dialog} ref={dialogRef}>
            <form onSubmit={handleSubmit}>
                <h2>Добавить Кальян</h2>
                {error && <p className={styles.dialogError}>{error}</p>}
                <label>
                    Табак:
                    <input
                        type="text"
                        value={tobacco}
                        onChange={(e) => setTobacco(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Крепость:<br/>
                    <input
                        type="number"
                        value={strength}
                        onChange={(e) => setStrength(+e.target.value)}
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
                    Вкус:
                    <textarea
                        value={taste}
                        onChange={(e) => setTaste(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Добавить</button>
                <button type="button" onClick={onClose}>Закрыть</button>
            </form>
        </dialog>
    );
};

export default AddHookahDialog;