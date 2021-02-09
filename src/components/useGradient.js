import useTheme from "components/useTheme";
import {calculateBrightness} from "components/layout/Layout";

/**
 *
 * @param degree
 * @returns {{stop(position:string, color:string, brightness:number, alpha:number): this, toString(): string}}
 */
export default function useGradient(degree) {
    const [theme] = useTheme();
    const gradient = {};


    return {
        stop(position, color, brightness, alpha) {
            if (color in theme) {
                color = theme[color];
            }
            gradient[position.toString()] = calculateBrightness(color, brightness, alpha).toRgbString();
            return this;
        },

        toString() {
            const gradientString = Object.keys(gradient).map(position => `${gradient[position]} ${parseFloat(position) * 100}%`).join(', ')
            if (degree > 0) {
                return `linear-gradient(${degree}deg, ${gradientString})`
            }
            return `radial-gradient(circle, ${gradientString})`
        }
    }

}