import BorderMarginPaddingPanel from "../properties/BorderMarginPaddingPanel";
import AlignmentAndGap from "../properties/AlignmentAndGap";
import WidthAndHeightPanel from "../properties/WidthAndHeightPanel";
import ColorBrightnessOpacity from "../properties/ColorBrightnessOpacity";

import NameAndIdPanel from "module/page-designer/properties/NameAndId";
import TextInputController from "module/page-renderer/controller/TextInputController";
import withTemplate from "module/page-designer/controls/controller/withTemplate";
import NumberInputController from "module/page-renderer/controller/NumberInputController";
import DateInputController from "module/page-renderer/controller/DateInputController";
import TimeInputController from "module/page-renderer/controller/TimeInputController";
import TextAreaController from "module/page-renderer/controller/TextAreaController";
import ButtonController from "module/page-renderer/controller/ButtonController";
import LabelController from "../../page-renderer/controller/LabelController";
import TableInputController from "module/page-renderer/controller/TableInputController";
import DataPanel from "module/page-designer/properties/DataPanel";
import withTableData from "components/table/withTableData";
import withAutoPopulateColumn from "components/table/withAutoPopulateColumn";
import GroupController from "module/page-renderer/controller/GroupController";
import GroupTemplate from "module/page-designer/controls/controller/GroupTemplate";
import FormTemplate from "module/page-designer/controls/controller/FormTemplate";
import FormController from "module/page-renderer/controller/FormController";
import FormPanel from "module/page-designer/properties/FormPanel";

export const Controls = {
    TEXT_INPUT: 'textInput',
    TEXT_AREA: 'textArea',
    BUTTON: 'button',
    GROUP: 'space',
    FORM: 'form',
    LABEL: 'label',
    NUMBER_INPUT: 'numberInput',
    DATE_INPUT: 'dateInput',
    TIME_INPUT: 'timeInput',
    TABLE_INPUT: 'tableInput'
};

export const ControlsNaming = {
    [Controls.TEXT_INPUT]: 'Text Input',
    [Controls.TEXT_AREA]: 'Text Area',
    [Controls.BUTTON]: 'Button',
    [Controls.GROUP]: 'Group',
    [Controls.LABEL]: 'Label',
    [Controls.DATE_INPUT]: 'Date',
    [Controls.TIME_INPUT]: 'Time',
    [Controls.NUMBER_INPUT]: 'Number',
    [Controls.TABLE_INPUT]: 'Table',
    [Controls.FORM]: 'Form'
};

export const ControlForPageRenderer = {
    [Controls.FORM]: FormController,
    [Controls.GROUP]: GroupController,
    [Controls.LABEL]: LabelController,
    [Controls.BUTTON]: ButtonController,
    [Controls.TEXT_INPUT]: TextInputController,
    [Controls.TEXT_AREA]: TextAreaController,
    [Controls.NUMBER_INPUT]: NumberInputController,
    [Controls.DATE_INPUT]: DateInputController,
    [Controls.TIME_INPUT]: TimeInputController,
    [Controls.TABLE_INPUT]: withTableData(withAutoPopulateColumn(TableInputController)),
}

export const ControlForPageDesigner = {
    [Controls.FORM]: withTemplate(FormTemplate),
    [Controls.GROUP]: withTemplate(GroupTemplate),
    [Controls.LABEL]: withTemplate(ControlForPageRenderer[Controls.LABEL]),
    [Controls.BUTTON]: withTemplate(ControlForPageRenderer[Controls.BUTTON]),
    [Controls.TEXT_INPUT]: withTemplate(ControlForPageRenderer[Controls.TEXT_INPUT]),
    [Controls.TEXT_AREA]: withTemplate(ControlForPageRenderer[Controls.TEXT_AREA]),
    [Controls.NUMBER_INPUT]: withTemplate(ControlForPageRenderer[Controls.NUMBER_INPUT]),
    [Controls.DATE_INPUT]: withTemplate(ControlForPageRenderer[Controls.DATE_INPUT]),
    [Controls.TIME_INPUT]: withTemplate(ControlForPageRenderer[Controls.TIME_INPUT]),
    [Controls.TABLE_INPUT]: withTemplate(ControlForPageRenderer[Controls.TABLE_INPUT])
}

export const ControlPropertiesCatalog = {
    [Controls.FORM]: [FormPanel, BorderMarginPaddingPanel, AlignmentAndGap, WidthAndHeightPanel, ColorBrightnessOpacity],
    [Controls.GROUP]: [BorderMarginPaddingPanel, AlignmentAndGap, WidthAndHeightPanel, ColorBrightnessOpacity],
    [Controls.TEXT_INPUT]: [NameAndIdPanel, BorderMarginPaddingPanel, WidthAndHeightPanel, ColorBrightnessOpacity],
    [Controls.TEXT_AREA]: [NameAndIdPanel, BorderMarginPaddingPanel, WidthAndHeightPanel, ColorBrightnessOpacity],
    [Controls.DATE_INPUT]: [NameAndIdPanel, BorderMarginPaddingPanel, WidthAndHeightPanel],
    [Controls.TIME_INPUT]: [NameAndIdPanel, BorderMarginPaddingPanel, WidthAndHeightPanel],
    [Controls.NUMBER_INPUT]: [NameAndIdPanel, BorderMarginPaddingPanel, WidthAndHeightPanel],
    [Controls.BUTTON]: [NameAndIdPanel, WidthAndHeightPanel],
    [Controls.TABLE_INPUT]: [NameAndIdPanel, DataPanel]
}

export const Icons = {
    [Controls.FORM]: <svg
        height={16}
        width={16}
        viewBox="0 0 68.153976 68.153977">
        <defs
            id="defs2">
            <clipPath
                id="clip0">
                <rect
                    x="581"
                    y="204"
                    width="343"
                    height="340"
                    id="rect833"/>
            </clipPath>
        </defs>
        <g
            transform="translate(-101.31109,-145.6641)">
            <path
                id="rect875"
                style={{
                    fill: '#000000',
                    fillOpacity: 1,
                    stroke: 'none',
                    strokeWidth: 30.2362,
                    strokeMiterlimit: 4,
                    strokeDasharray: 'none',
                    strokeOpacity: 1
                }}
                d="M 41.416016,36.365234 V 293.95508 H 145.9668 V 237.89062 H 97.480469 V 92.429688 H 145.9668 V 36.365234 Z m 153.039064,0 v 56.064454 h 48.48633 V 237.89062 h -48.48633 v 56.06446 H 299.00586 V 36.365234 Z"
                transform="matrix(0.26458333,0,0,0.26458333,90.353101,136.04247)"/>
        </g>
    </svg>,
    [Controls.GROUP]: <svg
        height={16}
        width={16}
        viewBox="0 0 68.153976 68.153977">
        <defs
            id="defs2">
            <clipPath
                id="clip0">
                <rect
                    x="581"
                    y="204"
                    width="343"
                    height="340"
                    id="rect833"/>
            </clipPath>
        </defs>
        <g
            transform="translate(-101.31109,-145.6641)">
            <path
                id="rect875"
                style={{
                    fill: '#000000',
                    fillOpacity: 1,
                    stroke: 'none',
                    strokeWidth: 30.2362,
                    strokeMiterlimit: 4,
                    strokeDasharray: 'none',
                    strokeOpacity: 1
                }}
                d="M 41.416016,36.365234 V 293.95508 H 145.9668 V 237.89062 H 97.480469 V 92.429688 H 145.9668 V 36.365234 Z m 153.039064,0 v 56.064454 h 48.48633 V 237.89062 h -48.48633 v 56.06446 H 299.00586 V 36.365234 Z"
                transform="matrix(0.26458333,0,0,0.26458333,90.353101,136.04247)"/>
        </g>
    </svg>,
    [Controls.LABEL]: <svg
        width={16} height={16}
        viewBox="0 0 89.958328 88.635422">
        <g
            transform="translate(-90.353101,-136.04247)">
            <path
                id="path838"
                style={{strokeWidth: '0.264583'}}
                d="m 135.33227,136.04247 -44.979169,88.63542 h 13.303069 l 11.63494,-22.88956 h 40.61148 l 11.63495,22.88956 h 12.77389 z m 0.26458,25.79688 14.19241,27.92181 h -28.38483 z"/>
        </g>
    </svg>,
    [Controls.TEXT_INPUT]: <svg viewBox={'0 0 355 355'} width="16" height="16"
                                overflow="hidden">
        <g transform="translate(-136 -104)">
            <rect x="145" y="112" width="337" height="338" stroke="#000000" strokeWidth="16"
                  strokeMiterlimit="8" fill="none"/>
            <path d="M239.5 151.5 239.5 410.825" stroke="#000000" strokeWidth="21.3333"
                  strokeMiterlimit="8" fill="none" fillRule="evenodd"/>
        </g>
    </svg>,
    [Controls.TEXT_AREA]: <svg viewBox={'0 0 565 564'} width="22" height="22" xmlns="http://www.w3.org/2000/svg"
                               overflow="hidden">
        <g transform="translate(-136 -104)">
            <rect x="145" y="112" width="547" height="548" stroke="#000000" strokeWidth="16"
                  strokeMiterlimit="8" fill="none"/>
            <path d="M239.5 151.5 239.5 410.825" stroke="#000000" strokeWidth="21.3333"
                  strokeMiterlimit="8" fill="none" fillRule="evenodd"/>
        </g>
    </svg>,
    [Controls.NUMBER_INPUT]: <svg viewBox={'0 0 355 355'} width="16" height="16"
                                  overflow="hidden">
        <g transform="translate(-136 -104)">
            <rect x="145" y="112" width="337" height="338" stroke="#000000" strokeWidth="16"
                  strokeMiterlimit="8" fill="none"/>
            <path d="M239.5 151.5 239.5 410.825" stroke="#000000" strokeWidth="21.3333"
                  strokeMiterlimit="8" fill="none" fillRule="evenodd"/>
        </g>
    </svg>,
    [Controls.TIME_INPUT]: <svg viewBox={'0 0 355 355'} width="16" height="16"
                                overflow="hidden">
        <g transform="translate(-136 -104)">
            <rect x="145" y="112" width="337" height="338" stroke="#000000" strokeWidth="16"
                  strokeMiterlimit="8" fill="none"/>
            <path d="M239.5 151.5 239.5 410.825" stroke="#000000" strokeWidth="21.3333"
                  strokeMiterlimit="8" fill="none" fillRule="evenodd"/>
        </g>
    </svg>,
    [Controls.DATE_INPUT]: <svg viewBox={'0 0 355 355'} width="16" height="16"
                                overflow="hidden">
        <g transform="translate(-136 -104)">
            <rect x="145" y="112" width="337" height="338" stroke="#000000" strokeWidth="16"
                  strokeMiterlimit="8" fill="none"/>
            <path d="M239.5 151.5 239.5 410.825" stroke="#000000" strokeWidth="21.3333"
                  strokeMiterlimit="8" fill="none" fillRule="evenodd"/>
        </g>
    </svg>,
    [Controls.BUTTON]: <svg viewBox={'0 0 377 376'} width="16" height="16" xmlns="http://www.w3.org/2000/svg"
                            overflow="hidden">
        <defs>
            <linearGradient x1="324.5" y1="112" x2="324.5" y2="472"
                            gradientUnits="userSpaceOnUse" spreadMethod="reflect" id="fill1">
                <stop offset="0" stopColor="#F6F8FC"/>
                <stop offset="0.18" stopColor="#A6A6A6"/>
                <stop offset="0.83" stopColor="#A6A6A6"/>
                <stop offset="1" stopColor="#D9D9D9"/>
            </linearGradient>
        </defs>
        <g transform="translate(-136 -104)">
            <rect x="145" y="112" width="359" height="360" stroke="#000000" strokeWidth="16"
                  strokeMiterlimit="8" fill="url(#fill1)"/>
        </g>
    </svg>,
    [Controls.TABLE_INPUT]: <svg viewBox={'0 0 355 355'} width="16" height="16"
                                 overflow="hidden">
        <g transform="translate(-136 -104)">
            <rect x="145" y="112" width="337" height="338" stroke="#000000" strokeWidth="16"
                  strokeMiterlimit="8" fill="none"/>
            <path d="M239.5 151.5 239.5 410.825" stroke="#000000" strokeWidth="21.3333"
                  strokeMiterlimit="8" fill="none" fillRule="evenodd"/>
        </g>
    </svg>
}