import { isPdbId, isJobId ,isAFId} from "./IdUtils";
import {RootPath} from "./Settings"

export const INFO_URL = RootPath+'infos/info.json';
//export const INFO_URL = '/infos/info.json';
  // "homepage": "http://192.168.3.4/castpdev",
//   const localIpAddress = 'http://10.8.169.96';
const pdbBaseUrl = (pdb) =>{
    const localIpAddress = 'http://10.8.169.96';

    if (isPdbId(pdb)) {
        // console.log( isPdbId);
        // console.log( localIpAddress + '/data/pdb/' + pdb.substring(1, 3) + '/' + pdb + '/');
        return localIpAddress + '/data/pdb/' + pdb.substring(1, 3) + '/' + pdb + '/';
    } else if (isJobId(pdb)) {
        return localIpAddress + '/data/tmppdb/' + pdb + '/';
    } else if (isAFId(pdb)) {
        // console.log( localIpAddress + '/data/AF_db/' + pdb.substring(3, 6) + '/' + pdb + '/');
        return localIpAddress + '/data/AF_db/' + pdb.substring(3, 6) + '/' + pdb + '/';
    }

    // if(isPdbId){
    //     // return 'http://sts.bioe.uic.edu/castp/data/pdb/'
    //     return 'http://192.168.3.4/data/pdb/'
    //         +pdb.substring(1,3)+'/'+pdb+'/';
    // }
    // else if(isJobId){// TODO need test
    //     return 'http://192.168.3.4/data/tmppdb/'+pdb+'/';
    // }
    // else{
    //     return 'http://sts.bioe.uic.edu/castp/data/pdb/an_directory_will_never_exist_hahaha/';
    // }
}

const pdbTmpUrl = (pdb) =>{
    return pdbBaseUrl(pdb)+'tmp/';
}

const pdbProcessedUrl = (pdb) =>{
    return pdbBaseUrl(pdb)+'processed/';
}

export function pdbGeneralInfoUrl(pdb) {
    return pdbProcessedUrl(pdb)+pdb+'.basic.json';
}
export function pdbPocSimiUrl(pdb) {
    return pdbProcessedUrl(pdb)+pdb+'.pocsimi.json';
}
export function pdbPdbFileUrl(pdb) {
    return pdbBaseUrl(pdb)+pdb+'.pdb';
}
export function pdbAssemblyUrl(pdb){
    return pdbProcessedUrl(pdb)+pdb+'.assem.json';
}
export function pdbDownloadUrl(pdb){
    return pdbProcessedUrl(pdb)+pdb+'.zip'
}
export function pdbPocMeasureUrl(pdb){
    return pdbTmpUrl(pdb)+pdb+'.measure.json'
}
export function pdbSeqInfoUrl(pdb){
    return pdbProcessedUrl(pdb)+pdb+'.seq.json'
}
export function pdbFeatInfoUrl(pdb){
    return pdbProcessedUrl(pdb)+pdb+'.feat.json'
}
export function pdbBulbUrl(pdb){
    return pdbTmpUrl(pdb)+pdb+'.bulb.json' 
}