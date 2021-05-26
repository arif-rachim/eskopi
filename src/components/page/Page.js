import useResource, {useResourceListener} from "components/useResource";
import {SYSTEM_PAGE_DESIGNS, SYSTEM_PAGES, SYSTEM_TABLES} from "components/SystemTableName";
import useObserver, {ObserverValue, useObserverListener, useObserverMapper,} from "components/useObserver";
import useForm from "components/useForm";
import {createContext, useCallback, useEffect, useRef} from "react";
import {ControlForPageRenderer} from "module/page-designer/controls/ControllerMapper";
import {mapToNameFactory} from "components/input/Input";
import {ControlRegistrationContextProvider, useControlRegistration} from "components/page/useControlRegistration";

function EmptyFunction() {
}

EmptyFunction.propertyTypes = {};

export default function Page({
                                 pageId,
                                 setTitle,
                                 name,
                                 onBlur,
                                 onChange = EmptyFunction,
                                 $value,
                                 $errors,
                                 compRef
                             }) {

    const $nameValue = useObserverMapper($value, mapToNameFactory(name));
    // eslint-disable-next-line
    const $errorValue = useObserverMapper($errors, mapToNameFactory(name));

    const propsRef = useRef({
        onChange, onBlur, handleSubmit: EmptyFunction
    });
    const localRef = useRef({});
    compRef = compRef || localRef;
    propsRef.current.onChange = onChange;
    propsRef.current.onBlur = onBlur;

    const [$onPageDesignLoad, setPageDesignLoad] = useResource();
    const [$onPageLoad] = useResource({url: `/db/${SYSTEM_PAGES}`});
    const [$pageDesign, setPageDesign] = useObserver();
    // eslint-disable-next-line
    const [$pageInfo, setPageInfo] = useObserver();
    useResourceListener($onPageDesignLoad, (status, pageDesign) => {
        if (status === 'success') {
            if (pageDesign.length > 0) {
                setPageDesign(pageDesign[0]);
            }
        }
    });
    useResourceListener($onPageLoad, (status, pageInfo) => {
        if (status === 'success') {
            const pageInfoDetail = (pageInfo) => {
                for (const pageInfoElement of pageInfo) {
                    if (pageInfoElement.id === pageId) {
                        return pageInfoElement;
                    }
                    if (pageInfoElement.children && pageInfoElement.children.length > 0) {
                        const detail = pageInfoDetail(pageInfoElement.children);
                        if (detail) {
                            return detail;
                        }
                    }
                }
                return undefined;
            }
            const detail = pageInfoDetail(pageInfo);
            if (detail) {
                if (setTitle) {
                    setTitle(detail.name);
                }
                setPageInfo(detail);
            }
        }
    });

    const {control, handleSubmit, reset} = useForm($nameValue?.current ? $nameValue.current : {});
    propsRef.current.handleSubmit = handleSubmit;
    useObserverListener($nameValue, nameValue => {
        nameValue = nameValue === undefined ? {} : nameValue;
        reset({...nameValue});
    });
    compRef.current.commitChanges = useCallback(function commitChanges() {
        propsRef.current.handleSubmit(function handleSubmit(data) {
            propsRef.current.onChange(data);
        })();
    }, []);

    useEffect(() => {
        setPageDesignLoad(`/db/${SYSTEM_PAGE_DESIGNS}`, {pageId})
    }, [pageId, setPageDesignLoad]);

    function commitChanges() {
        compRef.current.commitChanges();
    }

    commitChanges.propertyTypes = {};
    reset.propertyTypes = {};

    return <ControlRegistrationContextProvider>
        <PageActions commitChanges={commitChanges}
                     control={control}
                     handleSubmit={handleSubmit} reset={reset}>
            <ObserverValue $observers={useObserverMapper($pageDesign, data => data?.children)}>{
                (children) => {
                    children = children || [];
                    return children.map(child => {
                        const ChildRender = ControlForPageRenderer[child.type];
                        return <ChildRender key={child.id} data={child} control={control}/>
                    });
                }
            }</ObserverValue>
        </PageActions>
    </ControlRegistrationContextProvider>
}
export const PageControlContext = createContext({});

export function PageActions({
                                children,
                                commitChanges = EmptyFunction,
                                control,
                                reset = EmptyFunction
                            }) {
    useControlRegistration({
        dataFieldName: '',
        controllerName: 'page',
        id: 'page',
        actions: {
            commitChanges,
            reset,
            getValue: () => control.current.$value.current
        }
    });
    const [$systemTables, setSystemTables] = useObserver([]);
    const [$onTableLoads] = useResource({url: `/db/${SYSTEM_TABLES}`});
    useResourceListener($onTableLoads, (status, tables) => {
        if (status === 'success') {
            setSystemTables(tables);
        }
    })
    return <PageControlContext.Provider
        value={{control, $systemTables, reset, commitChanges}}>{children}</PageControlContext.Provider>;
}