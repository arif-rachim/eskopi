import {Horizontal, Vertical} from "components/layout/Layout";
import useForm, {Controller} from "../../../components/useForm";
import Button from "../../../components/button/Button";
import {useObserverMapper, useObserverValue} from "components/useObserver";
import Input from "components/input/Input";

export default function LoginScreen() {
    const {errors, handleSubmit, control} = useForm({userName: '', password: ''});

    return <Vertical color={"light"} height={'100%'} hAlign={'center'} vAlign={'center'}>
        <form action="" onSubmit={handleSubmit((data) => {

        })}>
            <Vertical gap={3} color={"light"} brightness={-0.5} p={5} pT={7} r={5} b={0.5}>
                <Controller control={control} render={Input} name={'userName'}/>
                <Controller control={control} render={Input} name={'password'} type={'password'}/>

                <Controller control={control} render={({$value, $errors, onChange, onBlur, data, name}) => {
                    return <Horizontal>
                        {data.map(data => {
                            return <label key={JSON.stringify(data)}>
                                <Horizontal vAlign={'center'} style={{whiteSpace: 'nowrap'}}>
                                    <Checkbox name={name} onBlur={onBlur} onChange={onChange} data={data}
                                              $value={$value} $errors={$errors}/>{data}</Horizontal>
                            </label>
                        })}
                    </Horizontal>
                }} data={['One', 'Two']} name={'saveHistory'} defaultValue={'One'}/>
                <Horizontal>
                    {JSON.stringify(errors)}
                </Horizontal>
                <Horizontal hAlign={'right'}>
                    <Button type={'submit'}>Log In</Button>
                </Horizontal>
            </Vertical>
        </form>
    </Vertical>
}


function Checkbox({name, data, $value, $errors, onChange, onBlur}) {
    const $nameValue = useObserverMapper($value, value => value[name]);
    let value = useObserverValue($nameValue);

    return <input type={'checkbox'}
                  name={name}
                  value={data}
                  checked={data === value}
                  onChange={_ => onChange(data)}
                  onBlur={_ => onBlur(data)}
    />
}