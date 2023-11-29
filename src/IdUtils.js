const alphaNumericRegex = /^[a-zA-Z0-9]*$/;
const numericRegex = /^[0-9]*$/;
const upperCaseAndNumericRegex = /^[a-zA-Z0-9]*$/;


export function isPdbId(id){
    if(id.length<4||id.length>=6){
        return false
    }
    if(id.length===4){
        // console.log(id.length)
        return alphaNumericRegex.test(id);
    }
    else{
        return alphaNumericRegex.test(id.slice(0,4)) 
            && numericRegex.test(id.slice(4));
    }
}

export function isAFId(id){
    if(id.length>10||id.length<6){
        return false
    } else {   
        return upperCaseAndNumericRegex.test(id);
    }
}


export function isJobId(id){
    // if(id.length!==15){
    //     return false;
    // }
    // if(!id.startsWith('j_')){
    //     return false;
    // }
    // return alphaNumericRegex.test(id.slice(2));
    if(id.length!==15||!id.startsWith('j_')){
        return false;
    } else {
    return alphaNumericRegex.test(id.slice(2));
    }
}

export function isValidId(id){
    return isJobId(id) || isPdbId(id) || isAFId(id);
}