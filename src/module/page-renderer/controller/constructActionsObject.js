import {post} from "components/useResource";

export default function constructActionsObject(dbTables = [], token, controls = {}) {
    const actions = {};
    for (const table of dbTables) {
        const doSave = `doSave${table.tableName}`;
        const doDelete = `doDelete${table.tableName}`;
        const doRead = `doRead${table.tableName}`;
        actions[doSave] = async (data) => {
            return post(`/db/${table.id_}`, ({...data, a: 'c'}), token);
        }
        actions[doDelete] = async (id) => {
            return post(`/db/${table.id_}`, ({id_: id, a: 'd'}), token);
        }
        actions[doRead] = async (data) => {
            return post(`/db/${table.id_}`, ({...data, a: 'r'}), token);
        }
    }
    Object.keys(controls).forEach(id => {
        const control = controls[id];
        const {actions: controlActions, controllerName} = control;
        controlActions.forEach(controlAction => {
            const action = {};
            Object.keys(controlAction.current).forEach(actionName => {
                action[actionName] = (...args) => controlAction.current[actionName].apply(null, args);
            });
            actions[controllerName] = action;
        });
    });
    return actions;
}