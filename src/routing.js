
import _ from "./module/index";
import sample_custom_controller from "./module/sample/custom-controller/index";
import sample_data_grid_1_data_grid_basic from "./module/sample/data-grid/1-data-grid-basic/index";
import sample_login_screen from "./module/sample/login-screen/index";
import sample_sidebar from "./module/sample/sidebar/index";
import sample_use_observer from "./module/sample/use-observer/index";
const routing = {
'' : _,
'sample/custom-controller' : sample_custom_controller,
'sample/data-grid/1-data-grid-basic' : sample_data_grid_1_data_grid_basic,
'sample/login-screen' : sample_login_screen,
'sample/sidebar' : sample_sidebar,
'sample/use-observer' : sample_use_observer
}
export default routing;
    