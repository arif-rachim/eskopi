import Sidebar from "components/sidebar/Sidebar";
import {Horizontal, Vertical} from "components/layout/Layout";
import Button from "components/button/Button";
import Input from "components/input/Input";
import useStateObserver from "components/useStateObserver";
import Label from "components/label/Label";

export default function SampleSideBar() {
    const [valueO, setValue] = useStateObserver('');
    const [errorO] = useStateObserver();
    return <Vertical p={3} width={'100%'} height={'100%'}>
        <Sidebar sidePanel={MySidePanel}>
            <Vertical color={"light"} height={'100%'} p={5}>
                This is the actual content
                <Input valueObserver={valueO} errorsObserver={errorO} onChange={setValue}/>
                <Label observer={valueO}/>
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