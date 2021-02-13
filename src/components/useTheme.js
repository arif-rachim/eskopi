import {createContext, useContext, useState} from "react";
import {Horizontal, Vertical} from "./layout/Layout";
import useLayers from "./useLayers";

const ThemeContext = createContext({
    surfaceColor: '#DDE6E0',
    accentColor: '#612A05',
    radiusMultiplier: 0,
    paddingMultiplier: 2.5,
    darkTextColor: '#333',
    lightTextColor: '#FAFAFA'
});

export default function useTheme() {
    const showPanel = useLayers();
    const [theme, setTheme] = useContext(ThemeContext);
    const openPanel = async () => {
        await showPanel(closePanel => <Theme closePanel={closePanel} setTheme={setTheme} theme={theme}/>)
    };
    return [theme, openPanel];
}


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

export function ThemeContextProvider({children}) {
    const [theme, setTheme] = useState({
        radiusMultiplier: 0,
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

