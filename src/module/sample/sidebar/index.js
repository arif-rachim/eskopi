import Sidebar from "components/sidebar/Sidebar";
import {Horizontal, Vertical} from "components/layout/Layout";
import Button from "components/button/Button";
import Input from "components/input/Input";
import useObserver from "components/useObserver";
import Label from "components/label/Label";

export default function SampleSideBar() {
    const [$value, setValue] = useObserver('');
    const [$error] = useObserver();
    return <Vertical width={'100%'} height={'100%'}>
        <Sidebar sidePanel={MySidePanel}>
            <Vertical color={"light"} height={'100%'} p={5}>
                This is the actual content
                <Input $value={$value} $errors={$error} onChange={setValue}/>
                <Label $value={$value}/>
            </Vertical>
        </Sidebar>
    </Vertical>
}

function MySidePanel({setShowSidebar}) {
    return <Vertical p={2} gap={5} color={"light"} brightness={-5}
                     style={{boxShadow: '0px 0px 7px 5px rgba(0,0,0,0.1)'}}>
        <Horizontal>Hello World</Horizontal>
        <Button color={"light"} onClick={() => {
            setShowSidebar(false);
        }}>Close Panel</Button>
    </Vertical>
}