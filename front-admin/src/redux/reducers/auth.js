import * as types from "../constants/auth";
import {DATA_USER} from "../../constants/constants";

let dataUser = null;
if (localStorage.getItem(DATA_USER) !== null) {
    try {
        if (JSON.parse(localStorage.getItem(DATA_USER)).accessToken) {
            dataUser = JSON.parse(localStorage.getItem(DATA_USER));
        } else {
            localStorage.removeItem(DATA_USER);
        }
    } catch(e) {
        localStorage.removeItem(DATA_USER);
    }
}
const initialState = {
    isShow: false,
    dataUser: dataUser
};

export default function auth(state = initialState, action) {
    switch (action.type) {
        case types.SET_DATA_USER:
            console.log(action.dataUser)
            if (action.dataUser !== null && action.dataUser.accessToken) {
                localStorage.setItem(DATA_USER, JSON.stringify(action.dataUser));
            } else {
                localStorage.removeItem(DATA_USER);
            }
            return {
                ...state,
                dataUser: action.dataUser
            }
        default:
            return state;
    }
}
