import {Horizontal, Vertical} from "components/layout/Layout";
import {useEffect} from "react";
import Tree from "components/tree/Tree";
import useObserver from "components/useObserver";
import Panel from "components/panel/Panel";
import Button from "components/button/Button";
import useForm, {Controller} from "components/useForm";
import Input from "components/input/Input";
import {generateUid} from "components/utils";
import InputCode from "components/input/InputCode";

export default function PageReducers({setTitle}) {
    useEffect(() => {
        setTitle('Reducers');
    }, [setTitle]);
    const [$treeData, setTreeData] = useObserver([]);
    const {control} = useForm();
    const [$selectedReducer, setSelectedReducer] = useObserver();

    return <Horizontal height={'100%'}>
        <Vertical height={'100%'} width={250}>
            <Panel headerTitle={'Type'} headerRenderer={TypeHeaderRenderer} setTreeData={setTreeData} height={'100%'}>
                <Tree $data={$treeData}
                      dataKey={(data) => data?.id}
                      itemRenderer={ItemRenderer}
                      $value={$selectedReducer}
                      onChange={setSelectedReducer}
                />
            </Panel>
        </Vertical>
        <Vertical height={'100%'} flex={'1 0 auto'}>
            <Panel headerTitle={'Reducer'} flex={'1 0 auto'} headerRenderer={ReducerRenderer}>
                <form action="" style={{height: '100%'}}>
                    <Vertical color={'light'} height={'100%'} p={3} gap={3}>
                        <Controller render={Input} label={'Reducer Name'} name={'name'} control={control}/>
                        <Vertical style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                        }}>
                            <Horizontal>{'(oldState,action) => {'}</Horizontal>
                            <Controller render={InputCode} name={'code'} label={''} control={control}/>
                            <Horizontal>{'}'}</Horizontal>
                        </Vertical>
                    </Vertical>
                </form>
                {/*
                action punya object input parameter,
                action trigger event
                */}
            </Panel>
        </Vertical>
    </Horizontal>
}

function ReducerRenderer(props) {
    return <Horizontal>
        <Horizontal flex={'1 0 auto'}>
            Reducer
        </Horizontal>
        <Horizontal gap={2}>
            <Button>Save</Button>
            <Button>Cancel</Button>
        </Horizontal>
    </Horizontal>
}

function TypeHeaderRenderer(props) {
    return <Horizontal gap={1}>
        <Horizontal flex={'1 0 auto'}>{'Type'}</Horizontal>
        <Button onClick={async () => {
            props.setTreeData(data => {
                const newData = [...data, {id: generateUid(), name: '', code: ''}]
                return newData;
            });
        }}>Add</Button>
        <Button>Delete</Button>
    </Horizontal>
}

const initialCode = `function add(oldState, payload) {
  return oldState;
}
`;

function ItemRenderer(props) {
    return <Vertical>
        {props.data.name || 'No Name'}
    </Vertical>
}