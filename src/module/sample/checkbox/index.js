import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "components/useForm";
import Checkbox from "components/input/Checkbox";
import Input from "components/input/Input";
import Button from "components/button/Button";

export default function TestCheckbox() {
    const {control, handleSubmit, $errors} = useForm();
    return <Vertical>
        <form action="" onSubmit={handleSubmit(data => {
            alert(JSON.stringify(data));
        })}>
            <Vertical>
                <Controller label={'This is name'} render={Input} name={"name"} control={control}
                            $errors={$errors}/>
                <Controller label={'This is checkbox'} render={Checkbox} name={"isMale"} control={control}
                            $errors={$errors}
                            validator={(value) => value === false ? 'Shoot' : ''}
                            horizontalLabelPositionWidth={100}
                />
                <Horizontal>
                    <Button>Save</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}