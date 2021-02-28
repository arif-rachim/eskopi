import _ from "./module/index";
import login from "./module/login/index";
import login_registration from "./module/login/registration/index";
import page_builder from "./module/page-builder/index";
import sample_custom_controller from "./module/sample/custom-controller/index";
import sample_data_grid_1_data_grid_basic from "./module/sample/data-grid/1-data-grid-basic/index";
import sample_form from "./module/sample/form/index";
import sample_list from "./module/sample/list/index";
import sample_login_screen from "./module/sample/login-screen/index";
import sample_sidebar from "./module/sample/sidebar/index";
import sample_tree from "./module/sample/tree/index";
import sample_use_observer from "./module/sample/use-observer/index";
import sample_use_observer_two from "./module/sample/use-observer-two/index";

const routing = {
    '': _,
    'login': login,
    'login/registration': login_registration,
    'page-builder': page_builder,
    'sample/custom-controller': sample_custom_controller,
    'sample/data-grid/1-data-grid-basic': sample_data_grid_1_data_grid_basic,
    'sample/form': sample_form,
    'sample/list': sample_list,
    'sample/login-screen': sample_login_screen,
    'sample/sidebar': sample_sidebar,
    'sample/tree': sample_tree,
    'sample/use-observer': sample_use_observer,
    'sample/use-observer-two': sample_use_observer_two
}
export default routing;
    