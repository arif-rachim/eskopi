import {Horizontal, Vertical} from "components/layout/Layout";
import Button from "components/button/Button";
import InputCode from "components/input/InputCode";
import useObserver, {ObserverValue, useObserverMapper, useObserverValue} from "components/useObserver";
import useSlideDownStackPanel from "components/page/useSlideDownStackPanel";
import Select from "components/input/Select";
import useResource, {useResourceListener} from "components/useResource";
import {SYSTEM_TABLES} from "components/SystemTableName";
import {isEmpty, isFunction, isNullOrUndefined, stringToCamelCase} from "components/utils";
import Panel from "components/panel/Panel";
import {Controller} from "components/useForm";
import {mapToNameFactory} from "components/input/Input";
import {useRegisteredControlsObserver} from "components/page/useControlRegistration";

function FormPanel({control, $selectedController}) {

    return <Vertical p={2} gap={2}>
        <Controller
            control={control}
            name={'handleSubmit'}
            $selectedController={$selectedController}
            title={'On Submit'}
            render={EventListenerInput}
        />

        <Controller
            control={control}
            name={'handleLoad'}
            title={'On Load'}
            $selectedController={$selectedController}
            render={EventListenerInput}
        />

    </Vertical>
}

function EventListenerInput({$value, onChange, name, $errors, $selectedController, title}) {
    const $nameValue = useObserverMapper($value, mapToNameFactory(name));
    const showPanel = useSlideDownStackPanel();
    const hasValue = useObserverValue($nameValue, value => !isNullOrUndefined(value) && value.length > 0);
    return <Horizontal>
        <Horizontal flex={'1 0 auto'}>{title}</Horizontal>
        <Button color={hasValue ? 'secondary' : 'light'} onClick={async () => {
            const code = await showPanel(CodeEditor, {
                title: title + ' Listener',
                $selectedController,
                $code: $nameValue
            })
            if (code === false) {
                return;
            }
            onChange(code);
        }}>Listener</Button>
    </Horizontal>
}

FormPanel.title = 'Form Event'
export default FormPanel;

function getFormControllerNames(children) {
    let result = [];
    for (const child of children) {
        if (child?.name) {
            result.push(child.name);
        }
        if (child?.children) {
            result = [...result, ...getFormControllerNames(child.children)];
        }
    }
    return result;
}

function TableSnippet({$data, $selectedTable, setSelectedTable, setValue}) {
    const $noSelectedTable = useObserverMapper($selectedTable, table => isNullOrUndefined(table));
    return <Horizontal gap={2} hAlign={'right'} p={2}>
        <Horizontal pR={2} flex={'1 0 auto'} gap={2}>
            <Select $data={$data} dataToLabel={data => data?.tableName}
                    $value={$selectedTable}
                    style={{flex: '1 0 auto'}}
                    onChange={setSelectedTable}
            />
            <Button $disabled={$noSelectedTable} onClick={() => {
                setValue(oldValue => {
                    if (isNullOrUndefined($selectedTable.current?.fields)) {
                        return oldValue;
                    }
                    oldValue = isFunction(oldValue) ? oldValue() : oldValue;
                    const fields = $selectedTable.current.fields.reduce((acc, f) => {
                        acc[f.name] = '';
                        return acc;
                    }, {id_: ''});
                    const code = `
const save${$selectedTable?.current?.tableName}Result = await actions.doSave${$selectedTable?.current?.tableName}(
    ${JSON.stringify(fields)});`;
                    return oldValue + code;
                })
            }}>Save</Button>
            <Button $disabled={$noSelectedTable} onClick={() => {
                setValue(oldValue => {
                    if (isNullOrUndefined($selectedTable?.current?.tableName)) {
                        return oldValue;
                    }
                    oldValue = isFunction(oldValue) ? oldValue() : oldValue;
                    const code = `
const delete${$selectedTable?.current?.tableName}Result = await actions.doDelete${$selectedTable?.current?.tableName}(id_="");`;
                    return oldValue + code;
                })
            }}>Delete</Button>
            <Button $disabled={$noSelectedTable} onClick={() => {
                setValue(oldValue => {
                    if (isNullOrUndefined($selectedTable?.current?.fields)) {
                        return oldValue;
                    }
                    oldValue = isFunction(oldValue) ? oldValue() : oldValue;
                    const fields = $selectedTable.current.fields.reduce((acc, f) => {
                        acc[f.name] = '';
                        return acc;
                    }, {id_: ''});
                    const code = `
const read${$selectedTable?.current?.tableName}Result = await actions.doRead${$selectedTable?.current?.tableName}(${JSON.stringify(fields)});`;
                    return oldValue + code;
                })
            }}>Read</Button>
        </Horizontal>
        <Horizontal pL={4} bL={2}>
            <Button onClick={() => {
                setValue(oldValue => {
                    oldValue = isFunction(oldValue) ? oldValue() : oldValue;
                    const code = `
actions.resetForm()`;
                    return oldValue + code;
                })
            }}>Reset</Button>
        </Horizontal>
    </Horizontal>;
}

function CodeEditor({title, $code, closePanel, $selectedController}) {
    const [$data, setData] = useObserver();
    const [$selectedTable, setSelectedTable] = useObserver();
    const [$onResourceLoad] = useResource({url: `/db/${SYSTEM_TABLES}`});
    useResourceListener($onResourceLoad, (status, tables) => {
        if (status === 'success') {
            setData(tables);
        }
    })
    const [$value, setValue] = useObserver(() => {
        if ($code?.current) {
            return $code.current;
        }
        const controllerNames = getFormControllerNames($selectedController.current.children);
        controllerNames.unshift('id_');
        return `const {${controllerNames.join(',')}} = data;`
    });

    return <Vertical width={800} p={4} gap={2}>
        <Horizontal style={{fontSize: 18}} hAlign={'center'}>{title}</Horizontal>
        <Panel headerTitle={'Resource'}>
            <TableSnippet $data={$data} $selectedTable={$selectedTable} setSelectedTable={setSelectedTable}
                          setValue={setValue}/>
        </Panel>
        <Panel headerTitle={'Component & Actions'}>
            <ComponentSnippet setValue={setValue}/>
        </Panel>

        <Vertical mT={2} style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12
        }}>
            <Horizontal>{`export default async function ${stringToCamelCase(title)}(data,actions){`}</Horizontal>
            <InputCode $value={$value} onChange={setValue}/>
            <Horizontal>{'}'}</Horizontal>
        </Vertical>
        <Horizontal hAlign={'right'} gap={2}>
            <Button type={"submit"} color={"primary"} onClick={() => closePanel($value.current)}>Save</Button>
            <Button onClick={() => closePanel(false)}>Close</Button>
        </Horizontal>
    </Vertical>
}

function ComponentSnippet({setValue}) {
    const $controls = useRegisteredControlsObserver();
    const [$selectedControl, setSelectedControl] = useObserver();
    return <Vertical gap={2} p={2}>
        <Horizontal flex={'1 0 auto'} gap={2}>
            <Select dataToLabel={data => {
                if (data === undefined) {
                    return '';
                }
                if (isEmpty($controls.current[data].name)) {
                    return data
                }
                return $controls.current[data].name;
            }}
                    $data={useObserverMapper($controls, controls => Object.keys(controls))}
                    style={{flex: '1 0 auto'}}
                    $value={$selectedControl}
                    onChange={setSelectedControl}
            />
        </Horizontal>
        <Horizontal>
            <ObserverValue $observers={$selectedControl}>
                {(controlId) => {
                    if (isNullOrUndefined(controlId)) {
                        return false;
                    }
                    const control = $controls.current[controlId];
                    const actions = control.actions.reduce((acc, action) => ({...acc, ...action.current}), {});
                    return Object.keys(actions).map(action => {
                        return <Button key={action} onClick={() => {
                            const propType = actions[action].propTypes;
                            if (isNullOrUndefined(propType)) {
                                throw new Error('propType is required for ' + action);
                            }
                            let parameterString = Object.keys(propType).join(',');
                            if (parameterString.length > 0) {
                                parameterString = `{${parameterString}`;
                            }
                            setValue(oldValue => {
                                const code = `
actions.${$controls.current[controlId].name}.${action}(${parameterString});
`;
                                return oldValue + code;
                            })
                        }}>{action}</Button>
                    })
                }}
            </ObserverValue>
        </Horizontal>
    </Vertical>
}