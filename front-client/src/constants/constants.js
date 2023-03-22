export const AUTH_FORM_TYPE_LOGIN = "AUTH_FORM_TYPE_LOGIN";
export const AUTH_FORM_TYPE_REGISTRATION = "AUTH_FORM_TYPE_REGISTRATION";
export const AUTH_FORM_TYPE_FORGOT_PASSWORD = "AUTH_FORM_TYPE_FORGOT_PASSWORD";


export const DATA_USER = 'dataUserCafeAdmin';

export const validateMessages = {
    required: "${label} bắt buộc!",
    types: {
        email: "${label} không phải định dạng của email!",
        number: "${label} không phải định dạng của số!",
    },
    number: {
        range: "${label} phải từ ${min} đến ${max}",
    },
};

export const LINK_DIRECTORY_FILES = "http://localhost:5001/photo/";
export const LINK_UPLOAD_PHOTO = "http://localhost:5001/uploadphoto";
