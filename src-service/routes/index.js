import express from "express";
import {v4 as uuid} from "uuid"
const router = express.Router();
const db = {};

function getData(params = [], query = {}, db = {}) {
    if (params.length === 0) {
        return db;
    }
    if (params.length === 1) {
        const [entity] = params;
        return db[entity];
    }
    if (params.length > 1) {
        const [entity, id, ...rest] = params;
        return getData(rest, query, db[entity][id]);
    }
}

function getParamsAndQuery(req) {
    const queryIndex = req.url.indexOf('?');
    const url = req.url.substring(1, queryIndex > 0 ? queryIndex : req.url.length);
    const params = decodeURIComponent(url).split('/').filter(s => s.length > 0);
    const query = Object.keys(req.query).reduce((acc,key) =>{
        const camelKey = camelize(key);
        acc[camelKey] = req.query[key];
        return acc;
    },{});
    return {params, query};
}

router.get('/*', (req, res) => {
    const {params, query} = getParamsAndQuery(req);
    const persistedData = getData(params, query, db);
    const {a,...qry} = query;
    if(a === 'c'){
        createOrUpdate(true,persistedData,params,query,qry,res);
    }else if(a === 'u'){
        createOrUpdate(false,persistedData,params,query,qry,res);
    }else if(a === 'd'){
        deleteData(params,query,res);
    }else{
        res.json({success:true,data:persistedData});
    }
});

function createOrUpdate(isCreate, persistedData, params, query, body, res) {
    const bodyIsEmpty = Object.keys(body).length === 0;
    if(bodyIsEmpty){
        throw new Exception('Empty body or query');
    }
    const now = new Date();
    if (isCreate) {
        if (persistedData === undefined || persistedData === null) {
            console.log(params.slice(0, params.length - 1));
            const parentData = getData(params.slice(0, params.length - 1), query, db);
            parentData[params[params.length - 1]] = {};
        }
        persistedData = getData(params, query, db);
        let id = '';
        if ('id' in body) {
            id = body.id;
        } else {
            id = uuid();
        }
        const data = {...body, modified_: now.toISOString(), id: id, created_: now.toISOString()}
        persistedData[id] = data;
        res.json({success:true,data});
    } else {
        let id = params[params.length - 1];
        const existingData = persistedData;
        if (new Date(existingData.modified_) > now) {
            throw new Exception(`Stale data ${id}`);
        }
        Object.keys(body).forEach(key => {
            existingData[key] = body[key];
        });
        existingData.modified_ = now.toISOString();
        res.json({success:true,data:existingData});
    }
}

router.post('/*',(req,res) => {
    const {params,query} = getParamsAndQuery(req);
    const body = Object.keys(req.body).reduce((acc,key) =>{
        const camelKey = camelize(key);
        acc[camelKey] = req.body[key];
        return acc;
    },{});
    let persistedData = getData(params, query, db);
    // if params is odd then this is a create
    const isCreate = params.length % 2 === 1;
    createOrUpdate(isCreate, persistedData, params, query, body, res);
});

function deleteData(params, query, res) {
    let id = params[params.length - 1];
    const parentData = getData(params.slice(0, params.length - 1), query, db);
    delete parentData[id];
    res.json({success: true, message: `${id} deleted`})
}

router.delete('/*',(req,res) => {
    const {params,query} = getParamsAndQuery(req);
    deleteData(params, query, res);
});

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

export default router;