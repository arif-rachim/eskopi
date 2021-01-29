import {Horizontal, Vertical} from "components/layout/Layout";
import Input from "../../../components/input/Input";
import useForm, {Controller} from "../../../components/useForm";
import Button from "../../../components/button/Button";

export default function LoginScreen() {
    const {errors, handleSubmit, register, controller} = useForm();

    return <Vertical color={"light"} height={'100%'} hAlign={'center'} vAlign={'center'}>
        <form action="" onSubmit={handleSubmit((data) => {

        })}>
            <Vertical gap={3} color={"light"} brightness={-0.5} p={5} pT={7} r={5} b={0.5}>
                <Input inputRef={register((value) => value && value.length > 0 ? '' : 'Hey your input invalid')}
                       name={'userName'} placeholder={'User Name'} required/>
                <Input inputRef={register((value) => value && value.length > 0 ? '' : 'Hey your password invalid')}
                       name={'password'} type={'password'} placeholder={'Password'} required/>

                <Controller controller={controller}  render={({value, onChange, onBlur, data, name}) => {
                    return <Horizontal>
                        {data.map(data => {
                            return <label key={JSON.stringify(data)}>
                                <Horizontal vAlign={'center'} style={{whiteSpace: 'nowrap'}}>
                                    <input type={'checkbox'}
                                           name={name}
                                           value={data}
                                           checked={value === data}
                                           onChange={_ => onChange(data)}
                                           onBlur={_ => onBlur(data)}
                                    />{data}</Horizontal>
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