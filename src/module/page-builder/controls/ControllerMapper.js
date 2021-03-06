import SpaceController from "module/page-builder/controls/controller/SpaceController";
import LabelController from "module/page-builder/controls/controller/LabelController";
import ButtonController from "module/page-builder/controls/controller/ButtonController";
import TextInputController from "module/page-builder/controls/controller/TextInputController";
import TextAreaController from "module/page-builder/controls/controller/TextAreaController";
import BorderMarginPaddingPanel from "../properties/BorderMarginPaddingPanel";
import AlignmentAndGap from "../properties/AlignmentAndGap";
import WidthAndHeightPanel from "../properties/WidthAndHeightPanel";
import ColorBrightnessOpacity from "../properties/ColorBrightnessOpacity";


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

export const ControlPropertiesCatalog = {
    [Controls.SPACE]: [BorderMarginPaddingPanel, AlignmentAndGap, WidthAndHeightPanel, ColorBrightnessOpacity],
    [Controls.TEXT_INPUT]: [BorderMarginPaddingPanel, WidthAndHeightPanel, ColorBrightnessOpacity]
}
