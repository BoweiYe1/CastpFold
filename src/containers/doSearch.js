import { push } from "connected-react-router";
import { store } from "../store/index"
import { RootPath } from "../Settings";

export  function doSearch(sid) {
    store.dispatch(push(RootPath+`search?${sid}`));
}