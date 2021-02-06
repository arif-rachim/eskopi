import express from "express";
import {v4 as uuid} from "uuid"

const router = express.Router();

const rootDb = {};

const ACTION_CREATE = 'c';
const ACTION_READ = 'r';
const ACTION_UPDATE = 'u';
const ACTION_DELETE = 'd';

const DB_PATH = process.env.DB_PATH ?? 'db';


const createEntity = async (queries) => {
    const id = uuid();
    const now = new Date();
    rootDb[id] = {...queries, id_: id, created_: now.toISOString()};
    return rootDb[id];
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

    let [entity, props] = await getNearestEntity(params);
    if (a === undefined) {
        throw new Error('Please provide action(a) {c:create|r:read|u:update|d:delete}')
    }
    if (a === ACTION_CREATE) {
        if (entity) {
            if (Array.isArray(entity)) {
                const persisted = await createEntity(queries);
                entity.push(persisted.id_);
                return persisted;
            } else {
                props = props.join('');
                const persisted = await createEntity({...queries, associated_: [{id_: entity.id_, property_: props}]});
                entity[props] = entity[props] || [];
                entity[props].push(persisted.id_);
                return persisted;
            }

        } else if (props.length >= 1) {
            const persisted = await createEntity(queries);
            props = props.join('');
            rootDb[props] = rootDb[props] || [];
            rootDb[props].push(persisted.id_);
            return persisted;
        }
    } else if (a === ACTION_UPDATE) {
        if (entity) {
            if (Array.isArray(entity)) {
                throw Error(`You are trying to update a collection, maybe what you mean is to create [${params}].`);
            }
            Object.keys(queries).forEach(q => {
                entity[q] = queries[q];
            });
            entity.modified_ = new Date().toISOString();
            return entity;
        } else {
            throw Error(`Unable to update entity [${params}] because it does not exist.`);
        }
    } else if (a === ACTION_DELETE) {

        if (entity && props.length === 0) {
            if (Array.isArray(entity)) {
                throw Error('Deleting collection is not allowed');
            }
            if (entity.associated_) {
                // first we remove all the associated
                for (const associatedLink of entity.associated_) {
                    const associatedEntity = await getEntity(associatedLink.id_);
                    if (associatedEntity) {
                        associatedEntity[associatedLink.property_] = associatedEntity[associatedLink.property_].filter(d => d !== entity.id_);
                    }
                }
            }
            delete rootDb[entity.id_];
            return `Entity ${entity.id_} Deleted`;
        } else {
            throw Error(`Unable to delete entity [${params}] because it does not exist.`);
        }
    } else if (a === ACTION_READ) {

        if (entity) {
            for (let i = 0; i < props.length; i++) {
                const prop = props[i];
                let entityHasNoProp = true;
                if(Array.isArray(entity)){
                    entityHasNoProp = entity.indexOf(prop) < 0;
                    if(entityHasNoProp) {
                        throw new Error(`${prop} does not exist`);
                    }
                }else{
                    entityHasNoProp = !(prop in entity && entity[prop] !== undefined);
                    if(entityHasNoProp) {
                        throw new Error(`${prop} does not exist in ${entity.id_}`);
                    }
                }

                entity = entity[prop];
            }
            return entity;
        } else {
            throw new Error(`Entity does not exist in [${params}]`);
        }
    }
    throw new Error(`Unable to process request [${params}] [${query}]`);
}


router.get('/*', (req, res) => {
    const {params, query} = getParamsAndQuery(req);

    processRequest(params, {a: ACTION_READ, ...query}).then(result => res.json({error: false, result})).catch(err => {
        console.error(err);
        res.json({error: err.message});
    });
});

router.post('/*', (req, res) => {
    const {params, query} = getParamsAndQuery(req);
    const suggestedAction = params.length % 2 === 1 ? ACTION_CREATE : ACTION_UPDATE;
    processRequest(params, {a: suggestedAction, ...query}).then(result => res.json({
        error: false,
        result
    })).catch(err => {
        console.error(err);
        res.json({error: err.message});
    });
});

router.delete('/*', (req, res) => {
    const {params, query} = getParamsAndQuery(req);
    const suggestedAction = ACTION_DELETE;
    processRequest(params, {a: suggestedAction, ...query}).then(result => res.json({
        error: false,
        result
    })).catch(err => {
        console.error(err);
        res.json({error: err.message});
    });
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

export default router;