import express from "express";
import {v4 as uuid} from "uuid"

const router = express.Router();

const entities = {};

const ACTION_CREATE = 'c';
const ACTION_UPDATE = 'u';
const ACTION_DELETE = 'd';
const DB_PATH = process.env.DB_PATH ?? 'db';


const createEntity = (queries) => {
    const id = uuid();
    entities[id] = queries;
    return id;
}
const getEntity = (id) => {
    if (id in entities) {
        return entities[id];
    }
    return false;
}
const getNearestEntity = async (params) => {
    let props = [];
    for (let i = params.length; i > 0; i--) {
        const param = params[i - 1];
        const entity = await getEntity(param)
        if (entity) {
            return [entity, props];
        } else {
            props.unshift(param);
        }
    }
    return [false, props];
}

router.get('/*', (req, res) => {
    (async () => {
        const {params, query} = getParamsAndQuery(req);
        const {a, ...queries} = query;
        let result = undefined;
        if (a === ACTION_CREATE) {
            let [entity, props] = await getNearestEntity(params);
            const key = createEntity(queries);
            if (entity) {
                if (Array.isArray(entity)) {
                    entity.push(key);
                } else {
                    props = props.join('');
                    entity[props] = entity[props] || [];
                    entity[props].push(key);

                }
                result = key
            } else if (props.length >= 1) {
                props = props.join('');
                entities[props] = entities[props] || [];
                entities[props].push(key);
                result = key;
            }
        } else if (a === ACTION_UPDATE) {
            let [entity, props] = await getNearestEntity(params);

            if (entity) {
                if (Array.isArray(entity)) {
                    throw Error('Invalid Path / Id');
                }
                result = entity;
                for (let i = 0; i < props.length; i++) {
                    result = result[props[i]];
                }
            } else {
                throw Error('Invalid Path / Id');
            }
        } else if (a === ACTION_DELETE) {

        } else {
            const [entity, props] = await getNearestEntity(params);
            if (entity) {
                result = entity;
                for (let i = 0; i < props.length; i++) {
                    result = result[props[i]];
                }
            }
        }
        res.json({error: false, params, query, result: result});
    })();

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