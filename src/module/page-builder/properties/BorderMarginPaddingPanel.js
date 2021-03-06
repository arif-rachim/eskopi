import {Vertical} from "components/layout/Layout";

function BorderMarginPaddingPanel() {
    return <Vertical p={2} width={250} height={168}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={'100%'}
            version="1.1"
            viewBox="0 0 140.653 92.475"
        >
            <g fillOpacity="1" transform="translate(-26.425 -84.724)">
                <path
                    fill="#f9cc9d"
                    strokeWidth="0.415"
                    d="M26.425 84.724H167.078V177.199H26.425z"
                />
                <path
                    fill="#fddd9b"
                    strokeWidth="0.315"
                    d="M43.341 95.846H150.161V166.077H43.341z"
                />
                <text
                    xmlSpace="preserve"
                    style={{lineHeight: "1.25"}}
                    x="27.371"
                    y="91.395"
                    fill="#000"
                    stroke="none"
                    strokeWidth="0.171"
                    fontFamily="sans-serif"
                    fontSize="6.841"
                    fontStyle="normal"
                    fontWeight="normal"
                >
                    <tspan x="27.371" y="91.395" strokeWidth="0.171">
                        margin
                    </tspan>
                </text>
                <path
                    fill="#c3d08b"
                    strokeWidth="0.222"
                    d="M59.054 106.177H134.449V155.747H59.054z"
                />
                <text
                    xmlSpace="preserve"
                    style={{lineHeight: "1.25"}}
                    x="45.365"
                    y="102.66"
                    fill="#000"
                    stroke="none"
                    strokeWidth="0.171"
                    fontFamily="sans-serif"
                    fontSize="6.822"
                    fontStyle="normal"
                    fontWeight="normal"
                >
                    <tspan x="45.365" y="102.66" strokeWidth="0.171">
                        border
                    </tspan>
                </text>
                <text
                    xmlSpace="preserve"
                    style={{lineHeight: "1.25"}}
                    x="60.712"
                    y="113.545"
                    fill="#000"
                    stroke="none"
                    strokeWidth="0.163"
                    fontFamily="sans-serif"
                    fontSize="6.501"
                    fontStyle="normal"
                    fontWeight="normal"
                >
                    <tspan x="60.712" y="113.545" strokeWidth="0.163">
                        padding
                    </tspan>
                </text>
                <path
                    fill="#8cb6c0"
                    strokeWidth="0.122"
                    d="M76.063 117.36H117.44V144.564H76.063z"
                />
                <path
                    fill="#fff"
                    stroke="#000"
                    strokeOpacity="0.5"
                    strokeWidth="0.213"
                    d="M86.996 85.07H106.107V95.33999999999999H86.996z"
                />
                <path
                    fill="#fff"
                    stroke="#000"
                    strokeOpacity="0.5"
                    strokeWidth="0.219"
                    d="M86.996 95.34H106.107V106.13900000000001H86.996z"
                />
                <path
                    fill="#fff"
                    stroke="#000"
                    strokeOpacity="0.5"
                    strokeWidth="0.219"
                    d="M86.996 106.14H106.107V116.939H86.996z"
                />
                <path
                    fill="#fff"
                    stroke="#000"
                    strokeOpacity="0.5"
                    strokeWidth="0.224"
                    d="M86.996 144.601H106.107V155.93H86.996z"
                />
                <path
                    fill="#fff"
                    stroke="#000"
                    strokeOpacity="0.5"
                    strokeWidth="0.219"
                    d="M86.996 155.93H106.107V166.729H86.996z"
                />
                <path
                    fill="#fff"
                    stroke="#000"
                    strokeOpacity="0.5"
                    strokeWidth="0.213"
                    d="M86.996 166.729H106.107V176.99900000000002H86.996z"
                />
                <path
                    fill="#fff"
                    stroke="#000"
                    strokeOpacity="0.5"
                    strokeWidth="0.201"
                    d="M150.215 125.323H167.138V135.593H150.215z"
                />
                <path
                    fill="#fff"
                    stroke="#000"
                    strokeOpacity="0.5"
                    strokeWidth="0.196"
                    d="M134.046 125.321H150.218V135.596H134.046z"
                />
                <path
                    fill="#fff"
                    stroke="#000"
                    strokeOpacity="0.5"
                    strokeWidth="0.201"
                    d="M117.123 125.323H134.046V135.593H117.123z"
                />
                <path
                    fill="#fff"
                    stroke="#000"
                    strokeOpacity="0.5"
                    strokeWidth="0.201"
                    d="M58.785 125.323H75.708V135.593H58.785z"
                />
                <path
                    fill="#fff"
                    stroke="#000"
                    strokeOpacity="0.5"
                    strokeWidth="0.192"
                    d="M43.369 125.323H58.785V135.593H43.369z"
                />
                <path
                    fill="#fff"
                    stroke="#000"
                    strokeOpacity="0.5"
                    strokeWidth="0.201"
                    d="M26.446 125.323H43.369V135.593H26.446z"
                />
            </g>
        </svg>
        <input name={'marginTop'} type="text"
               style={{
                   position: 'absolute',
                   top: 6,
                   width: 26,
                   height: 14,
                   left: 'calc( 50% - 15px)',
                   border: 'none',
                   outline: 'none'
               }}/>
        <input name={'borderTop'} type="text"
               style={{
                   position: 'absolute',
                   top: 25,
                   width: 26,
                   height: 14,
                   left: 'calc( 50% - 15px)',
                   border: 'none',
                   outline: 'none'
               }}/>
        <input name={'paddingTop'} type="text"
               style={{
                   position: 'absolute',
                   top: 42,
                   width: 26,
                   height: 14,
                   left: 'calc( 50% - 15px)',
                   border: 'none',
                   outline: 'none'
               }}/>

        <input name={'marginRight'} type="text"
               style={{
                   position: 'absolute',
                   right: 6,
                   width: 21,
                   height: 14,
                   top: 75,
                   border: 'none',
                   outline: 'none'
               }}/>
        <input name={'borderRight'} type="text"
               style={{
                   position: 'absolute',
                   right: 35,
                   width: 21,
                   height: 14,
                   top: 75,
                   border: 'none',
                   outline: 'none'
               }}/>
        <input name={'paddingRight'} type="text"
               style={{
                   position: 'absolute',
                   right: 62,
                   width: 21,
                   height: 14,
                   top: 75,
                   border: 'none',
                   outline: 'none'
               }}/>


        <input name={'paddingBottom'} type="text"
               style={{
                   position: 'absolute',
                   bottom: 43,
                   width: 26,
                   height: 14,
                   left: 'calc( 50% - 15px)',
                   border: 'none',
                   outline: 'none'
               }}/>
        <input name={'borderBottom'} type="text"
               style={{
                   position: 'absolute',
                   bottom: 25,
                   width: 26,
                   height: 14,
                   left: 'calc( 50% - 15px)',
                   border: 'none',
                   outline: 'none'
               }}/>
        <input name={'marginBottom'} type="text"
               style={{
                   position: 'absolute',
                   bottom: 6,
                   width: 26,
                   height: 14,
                   left: 'calc( 50% - 15px)',
                   border: 'none',
                   outline: 'none'
               }}/>

        <input name={'marginLeft'} type="text"
               style={{
                   position: 'absolute',
                   left: 6,
                   width: 21,
                   height: 14,
                   top: 75,
                   border: 'none',
                   outline: 'none'
               }}/>
        <input name={'borderLeft'} type="text"
               style={{
                   position: 'absolute',
                   left: 35,
                   width: 21,
                   height: 14,
                   top: 75,
                   border: 'none',
                   outline: 'none'
               }}/>
        <input name={'paddingLeft'} type="text"
               style={{
                   position: 'absolute',
                   left: 62,
                   width: 21,
                   height: 14,
                   top: 75,
                   border: 'none',
                   outline: 'none'
               }}/>
    </Vertical>
}

BorderMarginPaddingPanel.title = 'Border Margin and Padding';

export default BorderMarginPaddingPanel;