import SpaceController from "./controller/SpaceController";
import LabelController from "./controller/LabelController";
import ButtonController from "./controller/ButtonController";
import TextInputController from "./controller/TextInputController";
import TextAreaController from "./controller/TextAreaController";
import NumberInputController from "./controller/NumberInputController";
import DateInputController from "./controller/DateInputController";
import TimeInputController from "./controller/TimeInputController";
import {Controls} from "module/page-builder/controls/ControllerMapper";

export const ControllerMapper = {
    [Controls.SPACE]: SpaceController,
    [Controls.LABEL]: LabelController,
    [Controls.BUTTON]: ButtonController,
    [Controls.TEXT_INPUT]: TextInputController,
    [Controls.TEXT_AREA]: TextAreaController,
    [Controls.NUMBER_INPUT]: NumberInputController,
    [Controls.DATE_INPUT]: DateInputController,
    [Controls.TIME_INPUT]: TimeInputController,
}
