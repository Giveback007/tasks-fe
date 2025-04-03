import { twMerge } from "tailwind-merge";

/**
 * The function will test if the type of the first
 * argument equals testType. Argument testType is a string
 * representing a javascript type.
 *
 * @param val value to be tested
 * @param testType to check if typeof val === testType
 * @example
 * ```js
 * isType([], 'array') //=> true
 * isType(null, 'undefined') //=> false
 * ```
 */
export const isType = <T extends JsType> (
    val: any, testType: T
): val is JsTypeFind<T> => type(val) === testType;

/** An improvement on `typeof` */
export function type(val: any): JsType {
    if (val === null)               return 'null';
    if (Array.isArray(val))         return 'array';
    if (typeof val === 'object')    return 'object';
    if (val !== val)                return 'NaN';

    return typeof val;
}

export function cssMerge(...cssArgs: CssMergeArgs[]): str {
    // @ts-ignore
    cssArgs = Array.isArray(cssArgs) ? cssArgs.flat(Infinity) : cssArgs;
    const classes: ClassNameValue[] = [];

    for (let css of cssArgs) {
        if (isType(css, 'object')) {
            Object.entries(css).forEach(([cls, truthy]) => {
                if (truthy) classes.push(cls);
            });
        } else if (css) {
            classes.push(css)
        }
    }

    return twMerge(classes);
}

const debounceDict: Dict<num> = {};
export function debounceById(
    fn: AnyFnc,
    ms: num,
    id: str | num
) {
    const dId = debounceDict[id];
    if (dId) clearTimeout(dId);

    debounceDict[id] = setTimeout(fn, ms);
}

export const uuid = () => "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
);

export function formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hours = Math.floor(minutes / 60)

    const formattedMinutes = String(hours ? minutes % 60 : minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // Return in MM:SS format
    return `${hours ? hours + ':' : ''}${formattedMinutes}:${formattedSeconds}`;
}

export const wait = (ms: number) =>
    new Promise(res => setTimeout(res, ms));