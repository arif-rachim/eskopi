import SpaceController from "module/page-builder/controls/controller/SpaceController";
import LabelController from "module/page-builder/controls/controller/LabelController";
import ButtonController from "module/page-builder/controls/controller/ButtonController";
import TextInputController from "module/page-builder/controls/controller/TextInputController";
import TextAreaController from "module/page-builder/controls/controller/TextAreaController";


export const Controls = {
    TEXT_INPUT: 'textInput',
    TEXT_AREA: 'textArea',
    BUTTON: 'button',
    SPACE: 'space',
    LABEL: 'label'
};

export const ControlsNaming = {
    [Controls.TEXT_INPUT]: 'Text Input',
    [Controls.TEXT_AREA]: 'Text Area',
    [Controls.BUTTON]: 'Button',
    [Controls.SPACE]: 'Group',
    [Controls.LABEL]: 'Label'
};


export const ControlMapper = {
    [Controls.SPACE]: SpaceController,
    [Controls.LABEL]: LabelController,
    [Controls.BUTTON]: ButtonController,
    [Controls.TEXT_INPUT]: TextInputController,
    [Controls.TEXT_AREA]: TextAreaController
}


export const controllerPropertiesCatalog = {
    common: {
        p: {
            type: 'number',
            defaultValue: undefined
        },
        pL: {
            type: 'number',
            defaultValue: undefined
        },
        pR: {
            type: 'number',
            defaultValue: undefined
        },
        pT: {
            type: 'number',
            defaultValue: undefined
        },
        pB: {
            type: 'number',
            defaultValue: undefined
        },
        m: {
            type: 'number',
            defaultValue: undefined
        },
        mL: {
            type: 'number',
            defaultValue: undefined
        },
        mR: {
            type: 'number',
            defaultValue: undefined
        },
        mT: {
            type: 'number',
            defaultValue: undefined
        },
        mB: {
            type: 'number',
            defaultValue: undefined
        },

        b: {
            type: 'number',
            defaultValue: undefined
        },
        bL: {
            type: 'number',
            defaultValue: undefined
        },
        bR: {
            type: 'number',
            defaultValue: undefined
        },
        bT: {
            type: 'number',
            defaultValue: undefined
        },
        bB: {
            type: 'number',
            defaultValue: undefined
        },

        r: {
            type: 'number',
            defaultValue: undefined
        },
        rTL: {
            type: 'number',
            defaultValue: undefined
        },
        rTR: {
            type: 'number',
            defaultValue: undefined
        },
        rBL: {
            type: 'number',
            defaultValue: undefined
        },
        rBR: {
            type: 'number',
            defaultValue: undefined
        },
    },
    [Controls.TEXT_INPUT]: {
        name: {
            type: 'string',
            defaultValue: ''
        },
    },
    [Controls.TEXT_AREA]: {
        name: {
            type: 'string',
            defaultValue: ''
        },
    },
    [Controls.BUTTON]: {
        name: {
            type: 'string',
            defaultValue: ''
        },
    },
    [Controls.SPACE]: {
        layout: {
            type: 'select',
            data: ['vertical', 'horizontal'],
            defaultValue: 'vertical'
        },
        vAlign: {
            type: 'select',
            data: ['top', 'center', 'bottom'],
            defaultValue: ''
        },
        hAlign: {
            type: 'select',
            data: ['left', 'center', 'right'],
            defaultValue: ''
        },
    }
}