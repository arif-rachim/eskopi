import express from "express";
import {v4 as uuid} from "uuid"

const router = express.Router();

const rootDb = {};

const ACTION_CREATE = 'c';
const ACTION_UPDATE = 'u';
const ACTION_DELETE = 'd';
const DB_PATH = process.env.DB_PATH ?? 'db';


const createEntity = async (queries) => {
    const id = uuid();
    const now = new Date();
    rootDb[id] = {...queries, id_: id, created_: now.toISOString()};
    return id;
}
const getEntity = async (id) => {
    if (id in rootDb) {
        return rootDb[id];
    }
    return false;
}
const getNearestEntity = async (params) => {
    let props = [];
    for (let i = params.length; i > 0; i--) {
        const key = params[i - 1];
        const entity = await getEntity(key)
        if (entity) {
            return [entity, props];
        } else {
            props.unshift(key);
        }
    }
    return [false, props];
}

async function processRequest(params, query) {
    const {a, ...queries} = query;
    let result = undefined;
    let [entity, props] = await getNearestEntity(params);
    if (a === ACTION_CREATE) {
        let key = '';
        if (entity) {
            if (Array.isArray(entity)) {
                key = await createEntity(queries);
                entity.push(key);
            } else {
                props = props.join('');
                key = await createEntity({...queries, parent_: {id_: entity.id_, property_: props}});
                entity[props] = entity[props] || [];
                entity[props].push(key);
            }
            result = key
        } else if (props.length >= 1) {
            key = await createEntity(queries);
            props = props.join('');
            rootDb[props] = rootDb[props] || [];
            rootDb[props].push(key);
            result = key;
        }
    } else if (a === ACTION_UPDATE) {
        if (entity) {
            if (Array.isArray(entity)) {
                throw Error('Invalid Path / Id');
            }
            result = entity;
            Object.keys(queries).forEach(q => {
                result[q] = queries[q];
            });
            result.modified_ = new Date().toISOString();
        } else {
            throw Error('Invalid Path / Id');
        }
    } else if (a === ACTION_DELETE) {

        if (entity && props.length === 0) {
            if (Array.isArray(entity)) {
                throw Error('Invalid Path / Id');
            }
            if (entity.parent_) {
                const parentEntity = await getEntity(entity.parent_.id_);
                parentEntity[entity.parent_.property_] = parentEntity[entity.parent_.property_].filter(d => d !== entity.id_);
                delete rootDb[entity.id_];
                result = `Deleted`;
            }
        } else {
            throw Error('Invalid Path / Id');
        }
    } else {
        const [entity, props] = await getNearestEntity(params);
        if (entity) {
            result = entity;
            for (let i = 0; i < props.length; i++) {
                result = result[props[i]];
            }
        }
    }
    if (result === undefined) {
        throw Error('Invalid Path / Id');
    }
    return result;
}


router.get('/*', (req, res) => {
    const {params, query} = getParamsAndQuery(req);
    processRequest(params, query).then(result => res.json({error: false, result})).catch(err => {
        console.error(err);
        res.json({error: err.message});
    });
});

router.post('/*', (req, res) => {
    const {params, query} = getParamsAndQuery(req);
    processRequest(params, query).then(result => res.json({error: false, result})).catch(err => {
        console.error(err);
        res.json({error: err.message});
    });
});

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

export default router;