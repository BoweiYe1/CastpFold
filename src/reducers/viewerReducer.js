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

    //   case SETUP_SIMI_VIEWER:
    //     const uniqueKey1 = `${action.payload.searchId}_${action.payload.pocId}_${action.payload.pdbid}`;
    //     return {
    //       ...state,
    //       simipocviewer: {
    //         ...state.simipocviewer,
    //         [uniqueKey1]: action.payload.simiViewer,
    //       },
    //       simipocpdb: action.payload.pdbid,
    //     };
  
    // case SETUP_SIMI_BULB:
    //     const uniqueKey2 = `${action.payload.searchId}_${action.payload.pocId}_${action.payload.pdbid}`;
    //     if (!state.simipocviewer || !state.simipocviewer[uniqueKey2]) {
    //       console.error('SimiPoc Viewer is not initialized for key:', uniqueKey2);
    //       return state; // Return current state if viewer is not initialized
    //     }
    //     // Use map with the current bulb item as an argument
    //     let simiBulb = []
    //     action.payload.simiBulb.forEach(() => { simiBulb.push(state.simipocviewer[uniqueKey2].addShape({
    //       hidden: true,
    //       color: bulbDefaultColor,
    //       opacity: 0.8,
    //     }))});
    //     return {
    //       ...state,
    //       similarPocketBulbData: {
    //         ...state.similarPocketBulbData,
    //         [uniqueKey2]: simiBulb,
    //       },
    //       similarPocbetBulb: {
    //         ...state.similarPocbetBulb,
    //         [uniqueKey2]: action.payload.simiBulb,
    //       },
    //       simipocpdb: action.payload.pdbid,
    //     };
      
    case 'FETCH_BULB_DATA_SUCCESS':
          const uniqueKey = `${action.payload.pdb}_Pocsim`;
          return {
            ...state,
            similarPocketBulbData: {
              ...state.similarPocketBulbData,
              [uniqueKey]: action.payload.data
            }
          };
    
    case 'FETCH_BULB_DATA_FAILURE':
          // Handle the failure case, e.g., by setting an error message in the state
          return {
            ...state,
            error: action.error
          };
        
      default:
        return state;
    }
  }