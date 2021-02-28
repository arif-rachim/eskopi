import useUser, {EMPTY_USER} from "components/authentication/useUser";
import useObserver, {useObserverListener} from "components/useObserver";
import useGradient from "components/useGradient";
import {Vertical} from "components/layout/Layout";

export default function Footer() {
    const [$user] = useUser();
    const [$visible, setVisible] = useObserver($user.current !== EMPTY_USER);
    useObserverListener($user, (user) => {
        if (user !== EMPTY_USER) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });
    const PANEL_GRADIENT = useGradient(180).stop(0, 'light', 0).stop(0.9, 'light', -3).stop(1, 'light', -5).toString();
    return <Vertical background={PANEL_GRADIENT} p={2} $visible={$visible}>
        My Footer
    </Vertical>
}