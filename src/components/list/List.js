import {Vertical} from "components/layout/Layout";
import {ObserverValue} from "components/useObserver";

const DEFAULT_DATA_KEY = (data) => data?.id;

/**
 *
 * @param {any[]} $data
 * @param {React.FunctionComponent} itemRenderer
 * @param {function(data:*):string} dataKey
 * @param {function(event:*):void} onKeyboardUp
 * @param {function(event:*):void} onKeyboardDown
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function List({
                                 $data,
                                 itemRenderer = DefaultItemRender,
                                 dataKey = DEFAULT_DATA_KEY,
                                 onKeyboardDown,
                                 onKeyboardUp,
                                 ...props
                             }) {
    const Renderer = itemRenderer;
    return <Vertical>
        <ObserverValue $observer={$data} render={({value}) => {
            const data = value;
            return <Vertical tabIndex={0} onKeyDown={(event) => {

                if (event.code === 'ArrowDown' && onKeyboardDown) {
                    event.preventDefault();
                    event.stopPropagation();
                    onKeyboardDown.call();
                }
                if (event.code === 'ArrowUp' && onKeyboardDown) {
                    event.preventDefault();
                    event.stopPropagation();
                    onKeyboardUp.call();
                }

            }}>

                {data.map((data, index) => {
                    return <Vertical index={index} key={dataKey.apply(data, [data])}>
                        <Renderer data={data} index={index} {...props}/>
                    </Vertical>
                })}
            </Vertical>
        }}/>
    </Vertical>;
}


function DefaultItemRender({data}) {
    return <Vertical>{JSON.stringify(data)}</Vertical>
}