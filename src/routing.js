import access_management from "./module/access-management/index";
import _ from "./module/index";
import login from "./module/login/index";
import page_builder from "./module/page-builder/index";
import registration from "./module/registration/index";
import sample_custom_controller from "./module/sample/custom-controller/index";
import sample_data_grid_1_data_grid_basic from "./module/sample/data-grid/1-data-grid-basic/index";
import sample_list from "./module/sample/list/index";
import sample_login_screen from "./module/sample/login-screen/index";
import sample_sidebar from "./module/sample/sidebar/index";
import sample_use_observer from "./module/sample/use-observer/index";
import sample_use_observer_two from "./module/sample/use-observer-two/index";

const routing = {
    'access-management': access_management,
    '': _,
    'login': login,
    'page-builder': page_builder,
    'registration': registration,
    'sample/custom-controller': sample_custom_controller,
    'sample/data-grid/1-data-grid-basic': sample_data_grid_1_data_grid_basic,
    'sample/list': sample_list,
    'sample/login-screen': sample_login_screen,
    'sample/sidebar': sample_sidebar,
    'sample/use-observer': sample_use_observer,
    'sample/use-observer-two': sample_use_observer_two
}
export default routing;
    