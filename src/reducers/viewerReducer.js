// import {
//     SETUP_MOL_VIEWER,
//     SETUP_POC_BULB,
//   } from '../actions/viewerActions';
//   import {
//     SETUP_SIMI_VIEWER,
//     SETUP_SIMI_BULB,
//   } from '../actions/simiPocAction';
//   import { bulbDefaultColor } from '../components/searchpage/PocketBulb';
  
//   const initialState = {
//     viewer: null,
//     bulb: null,
//     pdbid: null,
//     simipocpdb: null,
//     simipocviewer: null,
//     similarPocketBulbData: null,
//     similarPocbetBulb: null,
//     similarPocketMeasureData: null,
//   };
  
//   export default function viewerReducer(state = initialState, action) {
//     switch (action.type) {
//       case SETUP_MOL_VIEWER:
//         return {
//           ...state,
//           viewer: action.payload.viewer,
//         };
//       case SETUP_POC_BULB:
//         // Use map instead of forEach to avoid mutation
//         const newBulbs = action.payload.bulb.map(bulbItem => ({
//           ...bulbItem,
//           shape: state.viewer.addShape({
//             hidden: true,
//             color: bulbDefaultColor,
//             opacity: 0.8,
//           }),
//         }));
//         return {
//           ...state,
//           bulb: newBulbs,
//           pdbid: action.payload.pdbid,
//         };
//       case SETUP_SIMI_VIEWER:
//         const uniqueKey1 = `${action.payload.searchId}_${action.payload.pocId}_${action.payload.pdbid}`;
//         return {
//           ...state,
//           simipocviewer: {
//             ...state.simipocviewer,
//             [uniqueKey1]: action.payload.simiViewer,
//           },
//           simipocpdb: action.payload.pdbid,
//         };
  
//       case SETUP_SIMI_BULB:
//         const uniqueKey2 = `${action.payload.searchId}_${action.payload.pocId}_${action.payload.pdbid}`;
//         if (!state.simipocviewer || !state.simipocviewer[uniqueKey2]) {
//           console.error('SimiPoc Viewer is not initialized for key:', uniqueKey2);
//           return state; // Return current state if viewer is not initialized
//         }
//         // Use map with the current bulb item as an argument
//         const simiBulbs = action.payload.simiBulb.map(bulbItem => state.simipocviewer[uniqueKey2].addShape({
//           hidden: true,
//           color: bulbDefaultColor,
//           opacity: 0.8,
//         }));
//         return {
//           ...state,
//           similarPocketBulbData: {
//             ...state.similarPocketBulbData,
//             [uniqueKey2]: simiBulbs,
//           },
//           similarPocbetBulb: {
//             ...state.similarPocbetBulb,
//             [uniqueKey2]: action.payload.simiBulb,
//           },
//           simipocpdb: action.payload.pdbid,
//         };
//       default:
//         return state;
//     }
//   }


  import {
    SETUP_MOL_VIEWER,
    SETUP_POC_BULB,
  } from '../actions/viewerActions';
  import {
    SETUP_SIMI_VIEWER,
    SETUP_SIMI_BULB,
    // UPDATE_SPHERES,
  } from '../actions/simiPocAction';
  import { bulbDefaultColor } from '../components/searchpage/PocketBulb';
  
  const initialState = {
    viewer: null,
    bulb: null,
    pdbid: null,
    simipocpdb: null,
    simipocviewer: null,
    similarPocketBulbData: null,
    similarPocbetBulb: null,
    similarPocketMeasureData: null,
    spheres: null,
  };
  
  export default function viewerReducer(state = initialState, action) {
    switch (action.type) {
      case SETUP_MOL_VIEWER:
        return {
          ...state,
          viewer: action.payload.viewer,
        };

        case SETUP_POC_BULB:
        let bulb = []
        action.payload.bulb.forEach(() => {
            bulb.push(state.viewer.addShape({hidden: true, color: bulbDefaultColor, opacity: 0.8 }))
        });
        return{
            ...state,
            bulb: bulb,
            pdbid: action.payload.pdbid,
        };

      case SETUP_SIMI_VIEWER:
        const uniqueKey1 = `${action.payload.searchId}_${action.payload.pocId}_${action.payload.pdbid}`;
        return {
          ...state,
          simipocviewer: {
            ...state.simipocviewer,
            [uniqueKey1]: action.payload.simiViewer,
          },
          simipocpdb: action.payload.pdbid,
        };
  
    case SETUP_SIMI_BULB:
        const uniqueKey2 = `${action.payload.searchId}_${action.payload.pocId}_${action.payload.pdbid}`;
        if (!state.simipocviewer || !state.simipocviewer[uniqueKey2]) {
          console.error('SimiPoc Viewer is not initialized for key:', uniqueKey2);
          return state; // Return current state if viewer is not initialized
        }
        // Use map with the current bulb item as an argument
        let simiBulb = []
        action.payload.simiBulb.forEach(() => { simiBulb.push(state.simipocviewer[uniqueKey2].addShape({
          hidden: true,
          color: bulbDefaultColor,
          opacity: 0.8,
        }))});
        return {
          ...state,
          similarPocketBulbData: {
            ...state.similarPocketBulbData,
            [uniqueKey2]: simiBulb,
          },
          similarPocbetBulb: {
            ...state.similarPocbetBulb,
            [uniqueKey2]: action.payload.simiBulb,
          },
          simipocpdb: action.payload.pdbid,
        };
        
    // case UPDATE_SPHERES:
    //     const { spheres, uniqueKey, simipocID, show } = action.payload;
    //     const existingPocData = state.similarPocketBulbData[uniqueKey] 
    //       ? state.similarPocketBulbData[uniqueKey][simipocID] 
    //       : null;
      
    //     // Ensure existing data is present to avoid null references
    //     if (!existingPocData) {
    //       console.error('No existing pocket bulb data to update for key:', uniqueKey);
    //       return state;
    //     }
      
    //     // Immutable update of the spheres
    //     const updatedBulbData = {
    //       ...state.similarPocketBulbData,
    //       [uniqueKey]: {
    //         ...state.similarPocketBulbData[uniqueKey],
    //         [simipocID]: {
    //           ...existingPocData,
    //           intersectionShape: {
    //             ...existingPocData.intersectionShape,
    //             sphere: spheres, // Assumes spheres is the new complete array for the shape
    //           },
    //           style: {
    //             ...existingPocData.style,
    //             hidden: !show,
    //           },
    //         },
    //       },
    //     };
      
    //     return {
    //       ...state,
    //       similarPocketBulbData: updatedBulbData,
    //     };
      default:
        return state;
    }
  }