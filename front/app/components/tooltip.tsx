import React from 'react';
import styles from './tooltip.module.css';
import {Hookah} from "@/api/hookah";
import {Food} from "@/api/food";
import {Drink} from "@/api/drinks"; // Create a CSS module for styling

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    return (
        <div className={styles.tooltipContainer}>
            {children}
            <div className={styles.tooltip}>
                {content}
            </div>
        </div>
    );
};

export default Tooltip;

interface HookahItemProps {
    hookah: Hookah;
}

export const HookahItem: React.FC<HookahItemProps> = ({ hookah }) => {
    return (
        <Tooltip content={
            <div>
                <p><strong>Tobacco:</strong> {hookah.tobacco}</p>
                <p><strong>Strength:</strong> {hookah.strength}</p>
                <p><strong>Cost:</strong> {hookah.cost}</p>
                <p><strong>Taste:</strong> {hookah.taste}</p>
            </div>
        }>
            <div className={styles.item}>
                <h3>?</h3>
            </div>
        </Tooltip>
    );
};

interface FoodItemProps {
    food: Food;
}

export const FoodItem: React.FC<FoodItemProps> = ({ food }) => {
    return (
        <Tooltip content={
            <div>
                <p><strong>Name:</strong> {food.name}</p>
                <p><strong>Ingredients:</strong> {food.ingredients}</p>
                <p><strong>Cost:</strong> {food.cost}</p>
                <p><strong>Is Hot:</strong> {food.isHot ? 'Yes' : 'No'}</p>
                <p><strong>Is Spicy:</strong> {food.isSpicy ? 'Yes' : 'No'}</p>
            </div>
        }>
            <div className={styles.item}>
                <h3>?</h3>
            </div>
        </Tooltip>
    );
};

interface DrinkItemProps {
    drink: Drink;
}

export const DrinkItem: React.FC<DrinkItemProps> = ({ drink }) => {
    return (
        <Tooltip content={
            <div>
                <p><strong>Name:</strong> {drink.name}</p>
                <p><strong>Ingredients:</strong> {drink.ingredients}</p>
                <p><strong>Cost:</strong> {drink.cost}</p>
                <p><strong>Is Alcoholic:</strong> {drink.isAlcoholic ? 'Yes' : 'No'}</p>
            </div>
        }>
            <div className={styles.item}>
                <h3>?</h3>
            </div>
        </Tooltip>
    );
};