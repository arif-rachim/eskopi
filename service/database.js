// In memory global store
import {v4 as uuid} from "uuid";
import path from "path";
import {access, readFile, writeFile} from "fs/promises";
import {constants} from "fs";
import express from "express";
import log from "./logger.js";
import {SYSTEM_PAGES} from "../src/components/SystemTableName.js";


const router = express.Router();

let store = {};
let warehouse = {};

// supported action
const ACTION_CREATE = 'c';
const ACTION_READ = 'r';
const ACTION_UPDATE = 'u';
const ACTION_DELETE = 'd';
const ACTION_LINK = 'l';
const ACTION_UNLINK = 'ul';

const WAREHOUSE_NAME = '.warehouse.json';
const STORE_NAME = '.store.json';

/**
 *
 * @param {object} queries
 * @param {string} entityType
 * @returns {*&{id_: string, created_: string, type_ : string, modified_ : string}}
 */
const createEntity = (queries, entityType) => {
    const id = uuid();
    const now = new Date();
    warehouse[id] = {type_: entityType, id_: id, created_: now.toISOString(), ...queries};
    return warehouse[id];
}

/**
 * Get the entity
 * @param {string[]} params
 * @returns {[boolean | *&{id_: string, created_: string, type_ : string,modified_ : string} , string[]]}
 */
const getEntity = (params) => {
    let props = [];
    for (const key of params.reverse()) {
        const entity = warehouse[key];
        if (entity) {
            return [entity, props];
        } else {
            props.unshift(key);
        }
    }
    return [false, props];
}

/**
 * @param {string[]} params
 * @param {object} queries
 * @returns {*&{id_: string, created_: string, type_ : string,modified_ : string}}
 */
const onActionCreate = (params, queries) => {
    if (params.length !== 1) {
        throw new Error('Entity creation should have at least 2 param');
    }
    const [entityType] = params;
    store[entityType] = store[entityType] || [];
    const collection = store[entityType];
    const entity = createEntity({...queries}, entityType);
    collection.push(entity.id_);
    persist();
    return entity;
}

/**
 * @param {string[]} params
 * @param {object} queries
 * @returns {*&{id_: string, created_: string, type_ : string,modified_ : string}}
 */
const onActionUpdate = (params, queries) => {
    if (params.length !== 2) {
        throw new Error('Entity update should have at least 2 param');
    }
    const [, entityId] = params;
    const entity = warehouse[entityId];
    Object.keys(queries).forEach(q => {
        entity[q] = queries[q];
    });
    entity.modified_ = new Date().toISOString();
    persist();
    return entity;
}

/**
 *
 * @param {string[]} params
 * @param {object} queries
 * @returns {string}
 */
const onActionDelete = (params, queries) => {
    if (params.length !== 2) {
        throw new Error('Entity deletion should have at least 2 param');
    }
    const [, entityId] = params;
    const entity = warehouse[entityId];

    // first we remove associated link
    if (entity.associated_) {
        for (const associatedLink of entity.associated_) {
            const [associatedEntityId, property] = associatedLink.split(':');
            const associatedEntity = warehouse[associatedEntityId];
            if (associatedEntity) {
                associatedEntity[property] = associatedEntity[property].filter(d => d !== associatedEntityId);
                associatedEntity.modified_ = new Date().toISOString();
            }
        }
    }

    // then we need to remove all links to this guy !
    Object.keys(entity).forEach(key => {
        if (Array.isArray(entity[key])) {
            const linksToRemove = entity[key];
            linksToRemove.forEach(link => {
                if (warehouse[link]) {
                    warehouse[link].associated_ = warehouse[link].associated_.filter(a => a !== `${entity.id_}:${key}`);
                }
            });
        }
    })

    // then we remove from the store
    store[entity.type_] = store[entity.type_].filter(id => id !== entityId);

    // then we remove from warehouse
    delete warehouse[entityId];

    persist();
    return `Entity ${entityId} Deleted`;
}

/**
 *
 * @param array
 * @param query
 * @returns {*}
 */
function filterByQuery(array, query) {
    // ini ada bug nih kalau query kosong ya berarti kita kembaliin aja semuanya !!
    const queryIsEmpty = query === null || query === undefined || typeof query !== 'object' || Object.keys(query).length === 0;
    const keys = queryIsEmpty ? [] : Object.keys(query);
    const filter = keys.reduce((acc, key) => {
        acc[key] = query[key].toString().toLowerCase()
        return acc;
    }, {});
    return array.reduce((acc, id) => {
        const item = warehouse[id];
        const isValid = keys.reduce((allMatch, key) => {
            let match = false;
            if (key in item && (item[key] !== undefined || item[key] !== null)) {
                match = item[key].toString().toLowerCase().indexOf(filter[key]) >= 0
            }
            return allMatch && match;
        }, true);
        if (item && isValid) {
            acc.push(item);
        }
        return acc;
    }, []);

}

/**
 * Function to flattened tree
 * @param tree
 * @returns {*}
 */
function flatTree(tree) {
    return tree.children.reduce((result, child) => {
        result[child.id] = child;
        if ('children' in child && child.children.length > 0) {
            const children = flatTree(child);
            result = {...result, ...children};
        }
        return result;
    }, {})
}

/**
 * @param {string[]} params
 * @param {object} queries
 * @returns {*&{id_: string, created_: string, type_ : string, modified_ : string, associated_ : string[]}}
 */
const onActionRead = (params, queries) => {
    if (params.length === 1) {
        const [type] = params;
        if (type in store && store[type] !== undefined) {
            return filterByQuery(store[type], queries);
        }
        throw new Error(`No collection of ${type} in store`);
    }

    if (params.length === 0) {
        // lets get the warehouse
        const pages = dbFind(SYSTEM_PAGES);
        const keys = Object.keys(store);
        let dict = {};
        if (pages && pages.length > 0) {
            dict = flatTree(pages[0]);
        }
        return keys.map(key => {
            const name = key in dict ? dict[key].name : key;
            return ({id: key, label: name})
        });
    }

    let [entity, props] = getEntity(params);
    if (!entity) {
        throw new Error(`Entity does not exist in [${params}]`);
    }
    for (const prop of props) {
        if (!(prop in entity && entity[prop] !== undefined)) {
            throw new Error(`${prop} does not exist in ${entity.id_}`);
        }
        entity = entity[prop];
    }
    return entity;
}

/**
 *
 * @param {string[]} params
 * @param {object} queries
 * @returns {string}
 */
const onActionLink = (params, queries) => {
    if (params.length !== 4) {
        throw new Error('To link at least it should be minimum 4 params')
    }

    const [, entityFromId, property, entityToId] = params;
    const associatedLink = `${entityFromId}:${property}`;

    const entityFrom = warehouse[entityFromId];
    const entityTo = warehouse[entityToId];

    entityFrom[property] = entityFrom[property] || [];
    entityFrom[property].push(entityToId);
    entityFrom.modified_ = new Date().toISOString();

    entityTo.associated_ = entityTo.associated_ || [];
    entityTo.associated_.push(associatedLink);
    entityTo.modified_ = new Date().toISOString();
    persist();
    return `Link ${entityFromId}/${property} to ${entityToId} completed`;

}

/**
 *
 * @param {string[]} params
 * @param {object} queries
 * @returns {string}
 */
const onActionUnlink = (params, queries) => {
    if (params.length !== 4) {
        throw new Error('To Unlink at least it should be minimum 4 params')
    }
    const [, entityFromId, property, entityToId] = params;
    const associatedLink = `${entityFromId}:${property}`;
    const entityFrom = warehouse[entityFromId];
    const entityTo = warehouse[entityToId];

    entityFrom[property] = entityFrom[property] || [];
    entityFrom[property] = entityFrom[property].filter(id => id !== entityToId);
    entityFrom.modified_ = new Date().toISOString();

    entityTo.associated_ = entityTo.associated_ || [];
    entityTo.associated_ = entityTo.associated_.filter(link => link !== associatedLink);
    entityTo.modified_ = new Date().toISOString();
    persist();
    return `Unlink ${entityFromId}/${property} and ${entityToId} completed`;

}


/**
 *
 * @param {string[]} params
 * @param {object} query
 * @returns {string|*}
 */
export function processRequest(params, query) {
    const {a, ...queries} = query;
    if (a === undefined) {
        throw new Error('Action identified in the request');
    }

    if (a.toString() === ACTION_CREATE) {
        return onActionCreate(params, queries);
    }
    if (a.toString() === ACTION_UPDATE) {
        return onActionUpdate(params, queries);
    }
    if (a.toString() === ACTION_DELETE) {
        return onActionDelete(params, queries);
    }
    if (a.toString() === ACTION_READ) {
        return onActionRead(params, queries);
    }
    if (a.toString() === ACTION_LINK) {
        return onActionLink(params, queries);
    }
    if (a.toString() === ACTION_UNLINK) {
        return onActionUnlink(params, queries);
    }
    throw new Error(`Unable to process request [${params}] ${JSON.stringify(query)}`);
}


router.get('/*', (req, res) => {
    const {params, query} = getParamsAndQuery(req);
    try {
        const data = processRequest(params, {a: ACTION_READ, ...query});
        return res.json({error: false, data});
    } catch (err) {
        return res.json({error: err.message});
    }

});

router.post('/*', (req, res) => {
    const {params, query} = getParamsAndQuery(req);
    let action = query.a;
    const dataAlreadyExist = 'id_' in query && query.id_ in warehouse;
    if (dataAlreadyExist) {
        if (isNullOrUndefined(action)) {
            action = ACTION_READ;
        }
        if (action === ACTION_CREATE) {
            action = ACTION_UPDATE;
        }
        if (params.length === 1) {
            params.push(query.id_);
        }
    } else {
        if (isNullOrUndefined(action)) {
            action = ACTION_READ;
        }
        if (action === ACTION_DELETE) {
            action = ACTION_READ;
        }
        if (action === ACTION_UPDATE) {
            action = ACTION_CREATE;
        }
    }
    try {
        const data = processRequest(params, {...query, a: action});
        return res.json({error: false, data});
    } catch (err) {
        return res.json({error: err.message});
    }
});


function toCamelCase(object) {
    return Object.keys(object).reduce((acc, key) => {
        const camelKey = camelize(key);
        acc[camelKey] = object[key];
        return acc;
    }, {});
}

export function getParamsAndQuery(req) {
    const queryIndex = req.url.indexOf('?');
    const url = req.url.substring(1, queryIndex > 0 ? queryIndex : req.url.length);
    const params = decodeURIComponent(url).split('/').filter(s => s.length > 0);
    const query = toCamelCase(req.query);
    const body = toCamelCase(req.body);
    return {params, query: {...body, ...query}};
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

const storePath = path.resolve(STORE_NAME);
const warehousePath = path.resolve(WAREHOUSE_NAME);

async function initialization() {
    log('Loading store', storePath);
    try {
        await access(storePath, constants.R_OK);
        await access(warehousePath, constants.R_OK);
        const storeSerializedData = await readFile(storePath, 'utf-8');
        const warehouseSerializedData = await readFile(warehousePath, 'utf-8');
        store = JSON.parse(storeSerializedData);
        warehouse = JSON.parse(warehouseSerializedData);
        log('Store successfully loaded');
    } catch (err) {
        log(err.message);
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        let context = this, args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

const persist = debounce(_persist, 1000, false);

async function _persist() {
    try {
        log('Persisting store');
        await writeFile(storePath, JSON.stringify(store));
        await writeFile(warehousePath, JSON.stringify(warehouse));
        log('Store successfully persisted');
    } catch (err) {
        log(err.message);
    }
}

initialization().then(() => {
    log('Initialization complete');
}).catch(err => {
    log(err);
})


/**
 * Function to check if a param is null or undefined
 * @param {any} param
 * @returns {boolean}
 */
export function isNullOrUndefined(param) {
    return param === undefined || param === null;
}

export const dbCreate = (type, config) => processRequest([type], {a: ACTION_CREATE, ...config});
export const dbFind = (type, config) => processRequest([type], {a: ACTION_READ, ...config});
export const dbFindOne = (type, config) => dbFind(type, config).reduce((acc, next) => acc ? acc : next, null);
export const dbGet = (entityId, config) => processRequest(['', entityId], {a: ACTION_READ, ...config});
export const dbUpdate = (entityId, config) => processRequest(['', entityId], {a: ACTION_UPDATE, ...config});
export const dbDelete = (entityId, config) => processRequest(['', entityId], {a: ACTION_DELETE, ...config});
export const dbLink = (entityFromId, prop, entityToId, config) => processRequest(['', entityFromId, prop, entityToId], {a: ACTION_LINK, ...config});
export const dbUnlink = (entityFromId, prop, entityToId, config) => processRequest(['', entityFromId, prop, entityToId], {a: ACTION_UNLINK, ...config});


export default router;