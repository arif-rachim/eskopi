import {useRef} from "react";
import useUser, {EMPTY_USER} from "components/authentication/useUser";
import useObserver, {useObserverListener} from "components/useObserver";
import usePopup from "components/usePopup";
import useResource, {useResourceListener} from "components/useResource";
import useGradient from "components/useGradient";
import {Horizontal, Vertical} from "components/layout/Layout";
import Button from "components/button/Button";
import Label from "components/label/Label";
import useClickOutside from "components/useClickOutside";
import useLayers from "components/useLayers";
import {useConfirmCancelMessage, useConfirmMessage, useErrorMessage, useInfoMessage} from "components/dialog/Dialog";
import useForm, {Controller} from "components/useForm";
import Input from "components/input/Input";

export function Header({setShowMenu, menuButtonRef}) {
    const [$user, setUser] = useUser();

    const [$showPopup, setShowPopup] = useObserver(false);
    const [$visible, setVisible] = useObserver($user.current !== EMPTY_USER);
    const showPopup = usePopup();
    const buttonRef = useRef();
    const [$logout, setLogout] = useResource();
    useResourceListener($logout, (status, result) => {
        if (status === 'success') {
            setUser(null);
        }
        if (status === 'error') {
            if (result.message === "jwt expired") {
                setUser(null);
            }
            if (result.message === "Access Denied") {
                setUser(null);
            }
        }
    });

    useObserverListener($user, (user) => {
        if (user !== EMPTY_USER) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });
    useObserverListener($showPopup, (isShowPopup) => {
        (async () => {
            if (isShowPopup) {
                await showPopup(closePanel => <UserProfileMenu closePanel={closePanel} parentRef={buttonRef}
                                                               setLogout={setLogout}/>, {
                    anchorRef: buttonRef,
                    matchWithAnchorWidth: true
                })
                setShowPopup(false);
            }
        })();
    });

    const PANEL_GRADIENT = useGradient(180).stop(0, 'light', -1).stop(0.1, 'light', -2).stop(0.9, 'light', -2).stop(1, 'light', -4).toString();

    return <Vertical background={PANEL_GRADIENT} $visible={$visible}>
        <Horizontal hAlign={'right'}>
            <Button domRef={menuButtonRef} b={0} bB={4} bR={2} p={0} pL={2} pR={2} onClick={() => setShowMenu(true)}>
                Menu
            </Button>
            <Horizontal style={{flex: 1}}/>
            <Button hAlign={'right'} domRef={buttonRef} brightness={-0.3} b={0} bL={2} bB={3} hoverBrightness={-0.7} minWidth={120}
                    onMouseOver={(event) => {
                        setShowPopup(true);
                    }}>
                <Label name={'name'} $value={$user} />
            </Button>

        </Horizontal>
    </Vertical>
}

function handleChangePassword(showPanel) {
    return async function (event) {
        await showPanel(closePanel => <ChangePasswordDialog closePanel={closePanel}/>);
    };
}


function handleLogOut(confirmAction, setLogout) {
    return async function (event) {
        const response = await confirmAction('Are you sure you want to Log Out ?');
        if (response === 'YES') {
            setLogout('/authentication/sign-out');
        }
    };
}

function UserProfileMenu({closePanel, parentRef, setLogout}) {
    const domRef = useRef();
    useClickOutside([domRef, parentRef], () => {
        closePanel();
    })
    const showPanel = useLayers();
    const confirmAction = useConfirmMessage();


    return <Vertical domRef={domRef} color={"light"} elevation={0} top={-5} bL={2} bR={2} bB={2} brightness={-0.3}
                     rBL={2} rBR={2}>
        <Horizontal p={2} pL={3} pR={3} bT={1} mT={3} color={'light'} brightness={-0.3} brightnessHover={-1}
                    hAlign={"right"} cursor={'pointer'} onClick={handleChangePassword(showPanel)}>Change
            Password</Horizontal>
        <Horizontal p={2} pL={3} pR={3} bT={1} color={'light'} brightness={-0.3} brightnessHover={-1} hAlign={"right"}
                    cursor={'pointer'} onClick={handleLogOut(confirmAction, setLogout)}>Log Out</Horizontal>
    </Vertical>
}


function ChangePasswordDialog({closePanel}) {
    const {controller, handleSubmit} = useForm({oldPassword: '', newPassword: '', confirmPassword: ''});
    const confirmCancel = useConfirmCancelMessage();
    const showError = useErrorMessage();
    const showInfo = useInfoMessage();
    const [$changePasswordResource, setResource] = useResource();
    useResourceListener($changePasswordResource, async (status, result) => {
        if (status === 'error') {
            await showError(result.message);
        }
        if (status === 'success') {
            await showInfo();
            closePanel();
        }
    })
    return <Vertical height={'100%'} hAlign={'center'} vAlign={'center'} color={"dark"} alpha={0.2} blur={1} top={0}
                     position={'absolute'} width={'100%'}>
        <form action="" onSubmit={handleSubmit((data) => setResource('authentication/change-password', {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        }))}>
            <Vertical color={"light"} elevation={1} p={5} r={3} width={200} gap={3}>
                <Controller controller={controller} name={'oldPassword'} render={Input} type={'password'}
                            label={'Old Password'} validator={requiredValidator('Old Password required')}/>
                <Controller controller={controller} name={'newPassword'} render={Input} type={'password'}
                            label={'New Password'} validator={requiredValidator('New Password required')}/>
                <Controller controller={controller} name={'confirmPassword'} render={Input} type={'password'}
                            label={'Confirm New Password'}
                            validator={confirmPasswordValidator('Confirm New Password required')}/>
                <Horizontal gap={2} hAlign={'right'}>
                    <Button type={"submit"} color={"primary"}>Save</Button>
                    <Button type={"button"} onClick={async () => {
                        if (Object.keys(controller.current.modified).length > 0) {
                            const result = await confirmCancel();
                            if (result === 'YES') {
                                closePanel();
                            }
                        } else {
                            closePanel();
                        }
                    }}>Cancel</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}

function requiredValidator(message) {
    return (...args) => {
        const value = args[0];
        if (value === undefined || value === null || value === '') {
            return message;
        }
        return '';
    }
}

function confirmPasswordValidator(message) {
    return (value, data) => {
        if (value === undefined || value === null || value === '') {
            return 'Confirm password mandatory';
        }
        if (data.newPassword !== value) {
            return 'Password is not match';
        }
        return '';
    }
}