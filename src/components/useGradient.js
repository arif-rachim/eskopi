import useTheme from "components/useTheme";
import {calculateBrightness} from "components/layout/Layout";

/**
 *
 * @param degree
 * @returns {{stop(position:string, color:string, brightness:number, alpha:number): this, toString(): string}}
 */
export default function useGradient(degree) {
    const [theme] = useTheme();
    const gradient = new Map();

    return {
        /**
         *
         * @param {string} position
         * @param {string} color
         * @param {number} brightness
         * @param {number} alpha
         * @returns {*}
         */
        stop(position, color, brightness, alpha) {
            if (color in theme) {
                color = theme[color];
            }
            gradient.set(position.toString(), calculateBrightness(color, brightness, alpha).toRgbString());
            return this;
        },
        /**
         *
         * @returns {string}
         */
        toString() {

            const gradientString = Array.from(gradient.keys()).map(position => `${gradient.get(position)} ${parseFloat(position) * 100}%`).join(', ')
            if (degree > 0) {
                return `linear-gradient(${degree}deg, ${gradientString})`
            }
            return `radial-gradient(circle, ${gradientString})`
        }
    }

}