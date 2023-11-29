

import { store } from "../store/index";
import {fetchSimiPocBulbData} from '../actions/httpActions'

export const SETUP_SIMI_VIEWER = 'SETUP_SIMI_VIEWER';
export const SETUP_SIMI_BULB = 'SETUP_SIMI_BULB';
export const UPDATE_SPHERES = 'UPDATE_SPHERES';

export const setupSimiViewer = (viewer, searchId, pocId, pdbid) => ({
    type: SETUP_SIMI_VIEWER,
    payload: { simiViewer: viewer, searchId, pocId, pdbid },
});

export const setupSimiBulb = (bulb, searchId, pocId, pdbid) => ({
    type: SETUP_SIMI_BULB,
    payload: { simiBulb: bulb, searchId, pocId, pdbid },
});

// export const updateSpheres = (spheres, uniqueKey, simipocID, show) => ({
//     type: UPDATE_SPHERES,
//     payload: { spheres, uniqueKey, simipocID, show },
// });

export function initializePocketViewer(viewer, searchId, pocId, pdbid) {
    store.dispatch(setupSimiViewer(viewer, searchId, pocId, pdbid));
}

function initializePocBulbs(searchId, pocId , pdbid) {
    console.log(pdbid);
    console.log(searchId);
    console.log(pocId);
    fetchSimiPocBulbData(pdbid);
    let state = store.getState();
    console.log(state);
    // Removed console logs for production code
    if (state.viewer.simipocbulb && pdbid === state.viewer.simipocpdb) {
        return;
    }
    console.log(state.repository.simipocbulb.value);
    store.dispatch(setupSimiBulb(state.repository.simipocbulb.value, searchId, pocId , pdbid));
}

export function pocBulbShow(searchId, pocId , simipocID, pdbid, show) {
    initializePocBulbs(searchId, pocId , pdbid);
    const uniqueKey = `${searchId}_${pocId}_${pdbid}`;
    let state = store.getState();
    console.log(state);

    let { simipocviewer, similarPocketBulbData } = state.viewer;

    if (show && similarPocketBulbData && similarPocketBulbData[uniqueKey] && similarPocketBulbData[uniqueKey][simipocID]) {
        const bulbData = similarPocketBulbData[uniqueKey][simipocID];
        console.log(bulbData);
        
        if (bulbData.intersectionShape.sphere.length === 0) {
            state.viewer.similarPocbetBulb[uniqueKey][simipocID].forEach(element => {
                bulbData.addSphere({center:element.c, radius:element.r});
                bulbData.updateStyle({hidden:!show});
            });
            console.log(state.viewer.similarPocbetBulb[uniqueKey][simipocID]);
            simipocviewer[uniqueKey].render();
        }

    }

}


export function protColor(colorful, viewer) {
    if (viewer) {
        if (colorful) {
            viewer.setStyle({}, { cartoon: { color: 'spectrum' } }, true);
        } else {
            viewer.setStyle({}, { cartoon: {} }, true);
        }

        viewer.render();
    }
}



export function temppocBulbShow(searchId, pocId, simipocID, pdbid, show, viewerInstance, similarPocketBulbData) {
    if (show && similarPocketBulbData && similarPocketBulbData[simipocID]) {
        const bulbData = similarPocketBulbData[simipocID];
        // console.log('Bulb Data:', bulbData);

        bulbData.forEach((element, index) => {
            // console.log(`Processing element ${index}:`, element);
            viewerInstance.addSphere({ center: element.c, radius: element.r , color: "#e41a1c", opacity: 0.8  });
            // Consider updating the style per sphere or outside the loop
        });

        // viewerInstance.updateStyle({ hidden: !show });
        viewerInstance.render();
        console.log('Viewer after rendering:', viewerInstance);
    }
}
