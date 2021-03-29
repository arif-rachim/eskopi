import Input, {mapToNameFactory} from "components/input/Input";
import usePopup from "components/usePopup";
import useObserver, {useObserverListener, useObserverMapper} from "components/useObserver";
import List from "components/list/List";
import {useRef} from 'react';
import useClickOutside from "components/useClickOutside";
import {Vertical} from "components/layout/Layout";
import {isNullOrUndefined} from "components/utils";

/**
 *
 * @param {useRef} inputRef
 * @param {string} name
 * @param {{current:boolean}} $disabled
 * @param {string} className
 * @param {string} color
 * @param {Object} style
 * @param {string} type
 * @param {number} p - padding
 * @param {number} pL - padding left
 * @param {number} pR - padding right
 * @param {number} pT - padding top
 * @param {number} pB - padding bottom
 *
 * @param {number} m - margin
 * @param {number} mL - margin left
 * @param {number} mR - margin right
 * @param {number} mT - margin top
 * @param {number} mB - margin bottom
 *
 * @param {number} b - border
 * @param {number} bL - border left
 * @param {number} bR - border right
 * @param {number} bT - border top
 * @param {number} bB - border bottom
 *
 * @param {number} r - radius
 * @param {number} rTL - radius top left
 * @param {number} rTR - radius top right
 * @param {number} rBL - radius bottom left
 * @param {number} rBR - radius bottom right
 * @param {boolean} autoCaps - indicate to enable autoCaps
 * @param {string} errorMessage - indicate there is error
 *
 * @param {function(value)} onChange,
 * @param {function()} onBlur,
 * @param {{current:*}} $value,
 * @param {{current:*}} $errors
 *
 * @param {any[]} $data
 * @param {React.FunctionComponent} itemRenderer
 * @param {function(data:*):string} dataKey
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Select({
                                   inputRef,
                                   name,
                                   $disabled,
                                   className = [],
                                   color,
                                   style,
                                   type = 'text',
                                   p, pL, pR, pT, pB,
                                   m, mL, mR, mT, mB,
                                   b, bL, bR, bT, bB,
                                   r, rTL, rTR, rBL, rBR,
                                   onChange, onBlur,
                                   autoCaps,
                                   $value,
                                   $errors,
                                   $data,
                                   itemRenderer,
                                   dataKey,
                                   dataToLabel = defaultDataToLabel,
                                   ...props
                               }) {
    useObserverListener($data, data => {
        console.log('We got new Data', data);
    })
    let domRef = useRef();
    domRef = inputRef || domRef;
    const [$showPopup, setShowPopup] = useObserver(false);
    const showPopup = usePopup();

    useObserverListener($showPopup, (isShowPopup) => {
        (async () => {
            if (isShowPopup) {
                const selectedItem = await showPopup(closePanel => <PopupMenu parentRef={domRef}
                                                                              closePanel={closePanel}
                                                                              itemRenderer={itemRenderer}
                                                                              dataKey={dataKey}
                                                                              $data={$data}
                                                                              $value={$value}
                                                                              dataToLabel={dataToLabel}
                />, {
                    anchorRef: domRef,
                    matchWithAnchorWidth: true
                })
                setShowPopup(false);
                if (onChange && selectedItem) {
                    onChange(selectedItem);
                }
            }
        })();
    });
    const $nameValue = useObserverMapper($value, mapToNameFactory(name, dataToLabel));
    const $nameErrors = useObserverMapper($errors, mapToNameFactory(name));

    return <Input inputRef={domRef}
                  $disabled={$disabled}
                  className={className}
                  color={color}
                  style={style}
                  type={'text'}
                  p={p}
                  pL={pL}
                  pR={pR} pT={pT} pB={pB}
                  m={m} mL={mL} mR={mR} mT={mT} mB={mB}
                  b={b} bL={bL} bR={bR} bT={bT} bB={bB}
                  r={r} rTL={rTL} rTR={rTR} rBL={rBL} rBR={rBR}
                  onChange={onChange} onBlur={onBlur}
                  autoCaps={autoCaps}
                  $value={$nameValue}
                  $errors={$nameErrors}
                  onFocus={() => setShowPopup(true)}
    />
}

function PopupMenu({parentRef, closePanel, itemRenderer, dataKey, $data, dataToLabel, $value}) {

    const domRef = useRef();
    useClickOutside([parentRef, domRef], () => {
        closePanel(false);
    });

    return <Vertical domRef={domRef} pL={0.5} pR={0.5} elevation={1}>
        <List itemRenderer={itemRenderer} dataKey={dataKey} $data={$data} $value={$value}
              onChange={closePanel}
              dataToLabel={dataToLabel}
        />
    </Vertical>
}


function defaultDataToLabel(data) {
    if (isNullOrUndefined(data)) {
        return '';
    }
    return data && data.toString();
}