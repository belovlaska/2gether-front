import star from "@/public/star.svg";
import {CSSProperties} from "react";

export default function RatingBar({rating, className, size}: {rating: number, className?: string, size: number}) {
    return (
        <div className={className} style={{width: `${size * 5}px`, display: 'flex'}}>
            {[...Array(5).fill(0)].map((_, index) =>
                <div key={index}
                     style={{
                         backgroundImage: `url(${star.src})`,
                         height: size + 'px',
                         width: size + 'px',
                         clipPath: `inset(0 ${(index - rating + 1) * 100}% 0 0)`
                }}/>
            )}
        </div>
    )
}