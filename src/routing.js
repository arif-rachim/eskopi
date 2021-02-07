
import login from "./module/login/index";
import registration from "./module/registration/index";
import sample_custom_controller from "./module/sample/custom-controller/index";
import sample_data_grid_1_data_grid_basic from "./module/sample/data-grid/1-data-grid-basic/index";
import sample_firebase_hello_world from "./module/sample/firebase/hello-world/index";
import sample_login_screen from "./module/sample/login-screen/index";
import sample_sidebar from "./module/sample/sidebar/index";
import sample_use_observer from "./module/sample/use-observer/index";
const routing = {
    'login': login,
    'registration': registration,
    'sample/custom-controller': sample_custom_controller,
    'sample/data-grid/1-data-grid-basic': sample_data_grid_1_data_grid_basic,
    'sample/firebase/hello-world': sample_firebase_hello_world,
    'sample/login-screen': sample_login_screen,
    'sample/sidebar': sample_sidebar,
    'sample/use-observer': sample_use_observer
}
export default routing;
    