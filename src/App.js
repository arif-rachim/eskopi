import {ThemeContextProvider} from "./components/useTheme";
import {LayerContextProvider} from "./components/useLayers";
import useRouter, {RouterProvider} from "./components/useRouter";
import "firebase/firestore";
import {FirebaseAppProvider} from "reactfire";

function App() {
    const Element = useRouter();
    return <Element.Element {...Element.params}/>;
}


/*
The apiKey in this configuration snippet just identifies your Firebase project on the Google servers.
It is not a security risk for someone to know it. In fact, it is necessary for them to know it, in order for them
to interact with your Firebase project.
This same configuration data is also included in every iOS and Android app that uses Firebase as its backend.
 */

const firebaseConfig = {
    apiKey: "AIzaSyAuXlBA8Dq_8gXKMY9auc78kE6EAG2jufI",
    authDomain: "eskopi-app.firebaseapp.com",
    projectId: "eskopi-app",
    storageBucket: "eskopi-app.appspot.com",
    messagingSenderId: "927203669393",
    appId: "1:927203669393:web:b05f60296f1fb9c79d9630",
    measurementId: "G-MM9E4TLPSG"
}

export default function Provider() {
    return (
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <ThemeContextProvider>
                <RouterProvider>
                    <LayerContextProvider>
                        <App/>
                    </LayerContextProvider>
                </RouterProvider>
            </ThemeContextProvider>
        </FirebaseAppProvider>)
};

