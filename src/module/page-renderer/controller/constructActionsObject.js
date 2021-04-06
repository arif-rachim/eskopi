import {post} from "components/useResource";

export default function constructActionsObject(reset, resources, token, $controls) {
    const actions = {
        resetForm: reset
    };

    for (const resource of resources) {
        const doSave = `doSave${resource.tableName}`;
        const doDelete = `doDelete${resource.tableName}`;
        const doRead = `doRead${resource.tableName}`;
        actions[doSave] = async (data) => {
            return post(`/db/${resource.id_}`, ({...data, a: 'c'}), token);
        }
        actions[doDelete] = async (id) => {
            return post(`/db/${resource.id_}`, ({id_: id, a: 'd'}), token);
        }
        actions[doRead] = async (data) => {
            return post(`/db/${resource.id_}`, ({...data, a: 'r'}), token);
        }
    }
    Object.keys($controls.current).forEach(id => {
        const control = $controls.current[id];
        const {actions: controlActions, name} = control;
        controlActions.forEach(controlAction => {
            const action = {};
            Object.keys(controlAction.current).forEach(actionName => {
                action[actionName] = (...args) => controlAction.current[actionName].apply(null, args);
            });
            actions[name] = action;
        });
    });
    return actions;
}