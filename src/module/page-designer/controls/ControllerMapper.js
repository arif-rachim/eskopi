import BorderMarginPaddingPanel from "../properties/BorderMarginPaddingPanel";
import AlignmentAndGapPanel from "module/page-designer/properties/AlignmentAndGapPanel";
import ColorBrightnessOpacity from "../properties/ColorBrightnessOpacity";
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
import {eventPanelFactory} from "module/page-designer/properties/EventPanel";
import ColumnsPanel from "module/page-designer/properties/ColumnsPanel";
import CheckboxController from "../../page-renderer/controller/CheckboxController";
import PageController from "module/page-renderer/controller/PageController";
import PageSelectorPanel from "module/page-designer/properties/PageSelectorPanel";
import withControlRegistration from "components/table/withControlRegistration";
import dynamicPropertiesPanelFactory from "module/page-designer/properties/DynamicPropertiesPanel";
import withChangeHandler from "components/input/withChangeHandler";
import withTableEvent from "components/table/withTableEvent";

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
    TABLE_INPUT: 'tableInput',
    CHECKBOX: 'checkboxInput',
    PAGE: 'page'
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
    [Controls.FORM]: 'Form',
    [Controls.CHECKBOX]: 'Checkbox',
    [Controls.PAGE]: 'Page'
};

export const ControlForPageRenderer = {
    [Controls.FORM]: FormController,
    [Controls.GROUP]: GroupController,
    [Controls.LABEL]: LabelController,
    [Controls.BUTTON]: ButtonController,
    [Controls.TEXT_INPUT]: withChangeHandler(TextInputController),
    [Controls.TEXT_AREA]: TextAreaController,
    [Controls.NUMBER_INPUT]: NumberInputController,
    [Controls.DATE_INPUT]: DateInputController,
    [Controls.TIME_INPUT]: TimeInputController,
    [Controls.TABLE_INPUT]: withTableEvent(withTableData(withAutoPopulateColumn(TableInputController))),
    [Controls.CHECKBOX]: CheckboxController,
    [Controls.PAGE]: withControlRegistration(PageController)
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
    [Controls.TABLE_INPUT]: withTemplate(ControlForPageRenderer[Controls.TABLE_INPUT]),
    [Controls.CHECKBOX]: withTemplate(ControlForPageRenderer[Controls.CHECKBOX]),
    [Controls.PAGE]: withTemplate(ControlForPageRenderer[Controls.PAGE])
}

const FORM_EVENT_CONFIG = {
    title: 'Form Event',
    events: {
        handleSubmit: {
            title: 'On Submit'
        },
        handleLoad: {
            title: 'On Load'
        }
    }
}

const INPUT_EVENT_CONFIG = {
    title: 'Input Event',
    events: {
        handleChange: {
            title: 'On Change'
        }
    }
}

const BUTTON_EVENT_CONFIG = {
    title: 'Button Event',
    events: {
        handleClick: {
            title: 'On Click'
        }
    }
}

const TABLE_EVENT_CONFIG = {
    title: 'Table Event',
    events: {
        handleSelectedRowChange: {
            title: 'On Selected Row Change'
        },
        handleBeforeSelectedRowChange: {
            title: 'On Before Selected Row Change'
        },
        handleDataChange: {
            title: 'On Data Change'
        },
        handleBeforeDataChange: {
            title: 'On Before Data Change'
        },
    }
}

const BUTTON_PROPERTIES = {
    title: 'Button Properties',
    properties: {
        buttonType: {
            title: 'Type',
            type: 'select', // string,boolean,select,number
            data: ['button', 'submit', 'reset']
        }
    }
}

const NAME_LABEL_PROPS = {
    title: 'Field and Label',
    properties: {
        dataFieldName: {
            title: 'Field',
            casing: 'camelCase'
        },
        label: {
            title: 'Label'
        }
    }
}

const CONTROLLER_NAME_PROPS = {
    title: 'Controller',
    properties: {
        controllerName: {
            title: 'Name',
            casing: 'camelCase'
        }
    }
}

const WIDTH_HEIGHT_PROPS = {
    title: 'Width and Height',
    properties: {
        width: {
            title: 'Width'
        },
        height: {
            title: 'Height'
        }
    }
}

export const ControlPropertiesCatalog = {
    [Controls.FORM]: [dynamicPropertiesPanelFactory(CONTROLLER_NAME_PROPS), eventPanelFactory(FORM_EVENT_CONFIG), BorderMarginPaddingPanel, AlignmentAndGapPanel, dynamicPropertiesPanelFactory(WIDTH_HEIGHT_PROPS), ColorBrightnessOpacity],
    [Controls.GROUP]: [BorderMarginPaddingPanel, AlignmentAndGapPanel, dynamicPropertiesPanelFactory(WIDTH_HEIGHT_PROPS), ColorBrightnessOpacity],
    [Controls.TEXT_INPUT]: [dynamicPropertiesPanelFactory(CONTROLLER_NAME_PROPS), dynamicPropertiesPanelFactory(NAME_LABEL_PROPS), eventPanelFactory(INPUT_EVENT_CONFIG), BorderMarginPaddingPanel, dynamicPropertiesPanelFactory(WIDTH_HEIGHT_PROPS), ColorBrightnessOpacity],
    [Controls.TEXT_AREA]: [dynamicPropertiesPanelFactory(CONTROLLER_NAME_PROPS), dynamicPropertiesPanelFactory(NAME_LABEL_PROPS), BorderMarginPaddingPanel, dynamicPropertiesPanelFactory(WIDTH_HEIGHT_PROPS), ColorBrightnessOpacity],
    [Controls.DATE_INPUT]: [dynamicPropertiesPanelFactory(CONTROLLER_NAME_PROPS), dynamicPropertiesPanelFactory(NAME_LABEL_PROPS), BorderMarginPaddingPanel, dynamicPropertiesPanelFactory(WIDTH_HEIGHT_PROPS)],
    [Controls.TIME_INPUT]: [dynamicPropertiesPanelFactory(CONTROLLER_NAME_PROPS), dynamicPropertiesPanelFactory(NAME_LABEL_PROPS), BorderMarginPaddingPanel, dynamicPropertiesPanelFactory(WIDTH_HEIGHT_PROPS)],
    [Controls.NUMBER_INPUT]: [dynamicPropertiesPanelFactory(CONTROLLER_NAME_PROPS), dynamicPropertiesPanelFactory(NAME_LABEL_PROPS), BorderMarginPaddingPanel, dynamicPropertiesPanelFactory(WIDTH_HEIGHT_PROPS)],
    [Controls.BUTTON]: [dynamicPropertiesPanelFactory(CONTROLLER_NAME_PROPS), dynamicPropertiesPanelFactory(NAME_LABEL_PROPS), eventPanelFactory(BUTTON_EVENT_CONFIG), dynamicPropertiesPanelFactory(WIDTH_HEIGHT_PROPS), dynamicPropertiesPanelFactory(BUTTON_PROPERTIES)],
    [Controls.TABLE_INPUT]: [dynamicPropertiesPanelFactory(CONTROLLER_NAME_PROPS), dynamicPropertiesPanelFactory(NAME_LABEL_PROPS), eventPanelFactory(TABLE_EVENT_CONFIG), DataPanel, ColumnsPanel, dynamicPropertiesPanelFactory(WIDTH_HEIGHT_PROPS)],
    [Controls.CHECKBOX]: [dynamicPropertiesPanelFactory(CONTROLLER_NAME_PROPS), dynamicPropertiesPanelFactory(NAME_LABEL_PROPS), BorderMarginPaddingPanel, dynamicPropertiesPanelFactory(WIDTH_HEIGHT_PROPS), ColorBrightnessOpacity],
    [Controls.PAGE]: [dynamicPropertiesPanelFactory(CONTROLLER_NAME_PROPS), dynamicPropertiesPanelFactory(NAME_LABEL_PROPS), PageSelectorPanel],
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
    </svg>,
    [Controls.CHECKBOX]: <svg viewBox={'0 0 355 355'} width="16" height="16"
                              overflow="hidden">
        <g transform="translate(-136 -104)">
            <rect x="145" y="112" width="337" height="338" stroke="#000000" strokeWidth="16"
                  strokeMiterlimit="8" fill="none"/>
            <path d="M239.5 151.5 239.5 410.825" stroke="#000000" strokeWidth="21.3333"
                  strokeMiterlimit="8" fill="none" fillRule="evenodd"/>
        </g>
    </svg>,
    [Controls.PAGE]: <svg
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
}