import { buildActionsFromMappings } from 'react-redux-fetch'
import {
    pdbGeneralInfoUrl,
    pdbPdbFileUrl,
    // pdbAssemblyUrl,
    pdbPocSimiUrl,
    AFmapurl,
    pdbPocMeasureUrl,
    pdbSeqInfoUrl,
    pdbFeatInfoUrl,
    pdbBulbUrl,
} from '../UrlManager'
import {store} from '../store/index'


function getPdbGeneral(pdb){
    return buildActionsFromMappings([{
        resource: 'general',
        method: 'get',
        request: {
            url: pdbGeneralInfoUrl(pdb),
        },
    }]).generalGet();
}

// function getPdbAssembly(pdb){
//     return buildActionsFromMappings([{
//         resource: 'assem',
//         method: 'get',
//         request: {
//             url: pdbAssemblyUrl(pdb),
//         },
//     }]).assemGet();
// }

function getPocMeasure(pdb){
    return buildActionsFromMappings([{
        resource: 'measure',
        method: 'get',
        request: {
            url: pdbPocMeasureUrl(pdb),
        },
    }]).measureGet();
}

function getAFmap(pdb){
    return buildActionsFromMappings([{
        resource: 'afmap',
        method: 'get',
        request: {
            url: AFmapurl(pdb),
        },
    }]).afmapGet();
}



function getSeqInfo(pdb){
    return buildActionsFromMappings([{
        resource: 'sequence',
        method: 'get',
        request: {
            url: pdbSeqInfoUrl(pdb),
        },
    }]).sequenceGet();
}

function getFeatInfo(pdb){
    return buildActionsFromMappings([{
        resource: 'feat',
        method: 'get',
        request: {
            url: pdbFeatInfoUrl(pdb),
        },
    }]).featGet();
}

function getPocSimiInfo(pdb){
    return buildActionsFromMappings([{
        resource: 'pocsimi',
        method: 'get',
        request: {
            url: pdbPocSimiUrl(pdb),
        },
    }]).pocsimiGet();
}

function getBulbData(pdb){
    return buildActionsFromMappings([{
        resource: 'bulb',
        method: 'get',
        request: {
            url: pdbBulbUrl(pdb),
        },
    }]).bulbGet();
}

function getSimiPocMeasure(pdb){
    return buildActionsFromMappings([{
        resource: 'simipocmeasure',
        method: 'get',
        request: {
            url: pdbPocMeasureUrl(pdb),
        },
    }]).simipocmeasureGet();
}

function getSimiPocBulbData(pdb){
    return buildActionsFromMappings([{
        resource: 'simipocbulb',
        method: 'get',
        request: {
            url: pdbBulbUrl(pdb),
        },
    }]).simipocbulbGet();
}

// function getAFmapping(pdb){
//     return buildActionsFromMappings([{
//         resource: 'AFmap',
//         method: 'get',
//         request: {
//             url: pdbBulbUrl(pdb),
//         },
//     }]).simipocbulbGet();
// }
//main entry
export function fetchPdbGeneral(pdb) {
    store.dispatch(getPdbGeneral(pdb));
}
// export function fetchPdbAssembly(pdb){
//     store.dispatch(getPdbAssembly(pdb));
// }
export function fetchPocMeasure(pdb){
    store.dispatch(getPocMeasure(pdb));
}

export function fetchAFmap(pdb){
    store.dispatch(getAFmap(pdb));
}

export function fetchSeqInfo(pdb){
    store.dispatch(getSeqInfo(pdb));
}
export function fetchFeatInfo(pdb){
    store.dispatch(getFeatInfo(pdb));
}
export function fetchBulbData(pdb){
    store.dispatch(getBulbData(pdb));
}
//simipoc
export function fetchPocSimi(pdb){
    store.dispatch(getPocSimiInfo(pdb));
}
export function fetchSimiPocBulbData(pdb){
    store.dispatch(getSimiPocBulbData(pdb));
}
export function fetchSimiPocMeasure(pdb){
    store.dispatch(getSimiPocMeasure(pdb));
}

export function onestepfetchSimiPocBulbData(pdb) {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            // Perform asynchronous operation here
            // For example, using fetch or axios to get data
            fetch(pdbBulbUrl(pdb))
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    dispatch({ type: 'FETCH_BULB_DATA_SUCCESS', payload: {data,pdb} });
                    resolve(data);
                })
                .catch(error => {
                    dispatch({ type: 'FETCH_BULB_DATA_FAILURE', error });
                    reject(error);
                });
        });
    };
}

// function getPdbFile(pdb){
//     return buildActionsFromMappings([{
//         resource: 'pdb',
//         method: 'get',
//         request: {
//             url: pdbPdbFileUrl(pdb),
//         },
//     }]).pdbGet();
// }
// export function fetchPdbFile(pdb) {
//     store.dispatch(getPdbFile(pdb));
// }

