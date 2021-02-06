import express from "express";
import morgan from "morgan";
import {v4 as uuid} from "uuid";
import path from "path";
import {access, readFile, writeFile} from "fs/promises";
import {constants} from "fs";

const app = express();
const router = express.Router();

const PORT = 3000;

/*
----------- SETTING UP THE EXPRESS SERVER --------
 */
app.use(morgan("dev"));
app.use(express.json());
app.use(router);
app.use((req, res) => res.json({success: false, message: 'Resource not found'}));
app.use((err, req, res, next) => res.json({success: false, message: err.message}));
app.listen(PORT, () => log('Server running at port ', PORT));

// In memory global store
let store = {};

// supported action
const ACTION_CREATE = 'c';
const ACTION_READ = 'r';
const ACTION_UPDATE = 'u';
const ACTION_DELETE = 'd';
const ACTION_LINK = 'l';
const ACTION_UNLINK = 'ul';

const DB_NAME = '.store.json';

const log = (...args) => console.log('[rest-service]', args.join(' '));

/**
 *
 * @param {object} queries
 * @param {string} entityType
 * @returns {*&{id_: string, created_: string, type_ : string, modified_ : string}}
 */
const createEntity = (queries, entityType) => {
    const id = uuid();
    const now = new Date();
    store[id] = {type_: entityType, id_: id, created_: now.toISOString(), ...queries};
    return store[id];
}

/**
 * Get the entity
 * @param {string[]} params
 * @returns {[boolean | *&{id_: string, created_: string, type_ : string,modified_ : string} , string[]]}
 */
const getEntity = (params) => {
    let props = [];
    for (const key of params.reverse()) {
        const entity = store[key]
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
        throw new Error('Entity deletion should have at least 2 param');
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
        throw new Error('Entity deletion should have at least 2 param');
    }
    const [, entityId] = params;
    const entity = store[entityId];
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
    const entity = store[entityId];

    // first we remove associated link
    if (entity.associated_) {
        for (const associatedLink of entity.associated_) {
            const [associatedEntityId, property] = associatedLink.split(':');
            const associatedEntity = store[associatedEntityId];
            if (associatedEntity) {
                associatedEntity[property] = associatedEntity[property].filter(d => d !== associatedEntityId);
                associatedEntity.modified_ = new Date().toISOString();
            }
        }
    }

    // then we remove from the catalog
    store[entity.type_] = store[entity.type_].filter(id => id !== entityId);

    // then we remove from db
    delete store[entityId];

    persist();
    return `Entity ${entityId} Deleted`;
}

/**
 * @param {string[]} params
 * @param {object} queries
 * @returns {*&{id_: string, created_: string, type_ : string, modified_ : string, associated_ : string[]}}
 */
const onActionRead = (params, queries) => {
    let [entity, props] = getEntity(params);
    if (!entity) {
        throw new Error(`Entity does not exist in [${params}]`);
    }

    for (const prop of props) {
        if (Array.isArray(entity) && entity.indexOf(prop) < 0) {
            throw new Error(`${prop} does not exist`);
        } else if (!(prop in entity && entity[prop] !== undefined)) {
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

    const entityFrom = store[entityFromId];
    const entityTo = store[entityToId];

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
    const entityFrom = store[entityFromId];
    const entityTo = store[entityToId];

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
function processRequest(params, query) {
    const {a, ...queries} = query;
    if (a === undefined) {
        throw new Error('Action identified in the request');
    }
    if (a === ACTION_CREATE) {
        return onActionCreate(params, queries);
    }
    if (a === ACTION_UPDATE) {
        return onActionUpdate(params, queries);
    }
    if (a === ACTION_DELETE) {
        return onActionDelete(params, queries);
    }
    if (a === ACTION_READ) {
        return onActionRead(params, queries);
    }
    if (a === ACTION_LINK) {
        return onActionLink(params, queries);
    }
    if (a === ACTION_UNLINK) {
        return onActionUnlink(params, queries);
    }
    throw new Error(`Unable to process request [${params}] ${JSON.stringify(query)}`);
}


router.get('/*', (req, res) => {
    const {params, query} = getParamsAndQuery(req);
    try {
        const result = processRequest(params, {a: ACTION_READ, ...query});
        return res.json({error: false, result});
    } catch (err) {
        return res.json({error: err.message});
    }

});

router.post('/*', (req, res) => {
    const {params, query} = getParamsAndQuery(req);
    const suggestedAction = params.length % 2 === 1 ? ACTION_CREATE : ACTION_UPDATE;
    try {
        const result = processRequest(params, {a: suggestedAction, ...query});
        return res.json({error: false, result});
    } catch (err) {
        return res.json({error: err.message});
    }

});

router.delete('/*', (req, res) => {
    const {params, query} = getParamsAndQuery(req);
    try {
        const result = processRequest(params, {a: ACTION_DELETE, ...query});
        return res.json({error: false, result});
    } catch (err) {
        return res.json({error: err.message});
    }
})

function toCamelCase(object) {
    return Object.keys(object).reduce((acc, key) => {
        const camelKey = camelize(key);
        acc[camelKey] = object[key];
        return acc;
    }, {});
}

function getParamsAndQuery(req) {
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

const storePath = path.resolve(DB_NAME);

async function initialization() {
    log('Loading store', storePath);
    try {
        await access(storePath, constants.R_OK)
        const serializedData = await readFile(storePath, 'utf-8');
        store = JSON.parse(serializedData);
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