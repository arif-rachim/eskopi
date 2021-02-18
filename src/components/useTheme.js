import {createContext, useContext, useState} from "react";
import {Horizontal, Vertical} from "./layout/Layout";
import useLayers from "./useLayers";

/**
 * ThemeContext key
 * @type {React.Context<{}>}
 */
const ThemeContext = createContext({});

/**
 * Hooks to get the application theme
 * @returns {[*, (function(): Promise<void>)]}
 */
export default function useTheme() {
    const showPanel = useLayers();
    const [theme, setTheme] = useContext(ThemeContext);
    const openPanel = async () => {
        await showPanel(closePanel => <Theme closePanel={closePanel} setTheme={setTheme} theme={theme}/>)
    };
    return [theme, openPanel];
}

/**
 * unction to map the elements and convert them into json.
 * @param {React.Element[]} elements
 * @returns {*|(function(*, *): *)}
 */
const formToJSON = (elements) =>

    [].reduce.call(
        elements,
        (data, element) => {
            if (element.name) {
                data[element.name] = element.value;
            }
            return data;
        },
        {},
    );

/**
 * event handler for on submit
 * @returns {function(*): void}
 */
function handleOnSubmit(setTheme, closePanel) {
    return e => {
        e.preventDefault();
        const data = formToJSON(e.target);
        setTheme(theme => ({...theme, ...data}));
        closePanel();
    }
}

/**
 * Element to modify the theme information
 * @param {function()} closePanel
 * @param {any} theme
 * @param {function(*):void} setTheme
 * @returns {JSX.Element}
 * @constructor
 */
function Theme({closePanel, theme, setTheme}) {
    return <Vertical style={{width: '100%', height: '100%', position: 'absolute', top: 0}} hAlign={'center'}
                     vAlign={'center'}>
        <form action="" onSubmit={handleOnSubmit(setTheme, closePanel)}>
            <Vertical>
                <input type="color" name={'surfaceColor'} defaultValue={theme.surfaceColor}/>
                <input type="color" name={'accentColor'} defaultValue={theme.accentColor}/>
                <input type="color" name={'darkTextColor'} defaultValue={theme.darkTextColor}/>
                <input type="color" name={'lightTextColor'} defaultValue={theme.lightTextColor}/>
                <Horizontal>
                    <button type={'submit'}>Save</button>
                    <button type={'reset'}>Reset</button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}

/**
 * ThemeContextProvider is the element to hold the theme state.
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export function ThemeContextProvider({children}) {
    const [theme, setTheme] = useState({
        radiusMultiplier: 2.5,
        paddingMultiplier: 2.5,
        primary: '#2E89FF',
        secondary: '#1FB34B',
        danger: '#f53d3d',
        light: '#f4f4f4',
        dark: '#222'
    });
    return <ThemeContext.Provider value={[theme, setTheme]}>
        {children}
    </ThemeContext.Provider>
}

