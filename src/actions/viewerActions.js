import { store } from "../store/index"

export const SETUP_MOL_VIEWER = 'SETUP_MOL_VIEWER';
export const SETUP_POC_BULB = 'SETUP_POC_BULB';
export const STYLE_POC_BULB = 'STYLE_POC_BULB';

const setupViewer = viewer => ({
    type: SETUP_MOL_VIEWER,
    payload: { viewer: viewer },
});

export function initializeGlobalViewer(viewer) {
    store.dispatch(setupViewer(viewer));
}

const setupBulb = (bulb,pdbid) => ({
    type: SETUP_POC_BULB,
    payload: { bulb: bulb, pdbid:pdbid },
});

function initializeBulbs(pdbid){
    let state = store.getState();
    if(state.viewer.bulb && pdbid === state.viewer.pdbid){
        return;
    }
    store.dispatch(setupBulb(state.repository.bulb.value, pdbid));
}

export function bulbShow(pocId, show){
    initializeBulbs(store.getState().repository.general.value.name.toLowerCase())
    let state = store.getState();
    console.log(state)
    let {viewer,bulb} = state.viewer;
    console.log(bulb);
    console.log(bulb[pocId]);

    if(show){
        if(bulb[pocId].intersectionShape.sphere.length===0){
            // bulb[pocId] = viewer.addShape({hidden: true, color: bulbDefaultColor, opacity: 0.8 });
            state.repository.bulb.value[pocId].forEach(element => {
                // console.log(`Bulb ${pocId} Data:`, element);
                // bulb[pocId].addSphere({...element, r:element.radius})//FIXME change this part r:radius
                bulb[pocId].addSphere({center:element.c, radius:element.r});
            });

        }
    }
    bulb[pocId].updateStyle({hidden:!show})
    viewer.render();
    console.log(state)
}

export function bulbColor(pocId, color){
    initializeBulbs(store.getState().repository.general.value.name.toLowerCase())
    let state = store.getState();
    console.log(state)
    let {viewer,bulb} = state.viewer;
    bulb[pocId].updateStyle({color:color})
    viewer.render();
}

export function resStyle(residues, style){
    let viewer = store.getState().viewer.viewer;
    if(style==='surface'){
        // remove other style first
        let spec = {cartoon:{}};
        residues.forEach(res=>{
            viewer.setStyle( {chain:res.chain, resi:res.seqId}, spec);
        });

        let atoms = []
        residues.forEach(res => {
            res.atoms.forEach(atm =>{
                atoms.push({chain:res.chain, resi:res.seqId, atom:atm.atom});
            })
        });

        viewer.addSurface("VDW", {},
            {
                predicate: function (atom) {
                    for (var k = 0; k < atoms.length; k++) {
                        // show the surface of only the pocket-forming atoms                            
                        if (atom.chain === atoms[k].chain && atom.resi === atoms[k].resi && atom.atom === atoms[k].atom) {
                            return true;
                        }
                    }
                    return false;
                }
            },
            {
                predicate: function (atom) {
                    for (var k = 0; k < atoms.length; k++) {
                        // select the whole residues to construct the surface
                        if (atom.chain === atoms[k].chain && atom.resi === atoms[k].resi) {
                            return true;
                        }
                    }
                    return false;
                }
            }
        );
    }
    else{
        viewer.removeAllSurfaces();
        let spec = {cartoon:{}};
        spec[style] = {}
        residues.forEach(res=>{
            viewer.setStyle( {chain:res.chain, resi:res.seqId}, spec);
        });
    }
    viewer.render();
}

export function protColor(colorful){
    let viewer = store.getState().viewer.viewer;
    console.log(store.getState());
    if(colorful){
        viewer.setStyle({}, {cartoon:{color: 'spectrum'}}, true);
    }
    else{
        viewer.setStyle({}, {cartoon:{}}, true);
    }
    viewer.render();
}