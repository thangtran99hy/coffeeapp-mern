import * as types from "../constants/auth";

let dataUser = null;
if (localStorage.getItem("dataUserCafeClient") !== null) {
    try {
        if (JSON.parse(localStorage.getItem("dataUserCafeClient")).accessToken) {
            dataUser = JSON.parse(localStorage.getItem("dataUserCafeClient"));
        } else {
            localStorage.removeItem("dataUserCafeClient");
        }
    } catch(e) {
        localStorage.removeItem("dataUserCafeClient");
    }
}
const initialState = {
    isShow: false,
    dataUser: dataUser
};

export default function auth(state = initialState, action) {
    switch (action.type) {
        case types.SET_DATA_USER:
            if (action.dataUser !== null && action.dataUser.accessToken) {
                localStorage.setItem("dataUserCafeClient", JSON.stringify(action.dataUser));
            } else {
                localStorage.removeItem("dataUserCafeClient");
            }
            return {
                ...state,
                dataUser: action.dataUser
            }
        default:
            return state;
    }
}
