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

export const ROLE_ADMIN = 'admin';
export const ROLE_CASHIER = 'cashier';
export const ROLE_CUSTOMER = 'customer';
export const ROLE_INVENTORY_MANAGER = 'inventoryManager';

export const TABLE_STATUS_BUSY = 'busy';
export const TABLE_STATUS_FREE = 'free';
export const TABLE_STATUS_BOOKED = 'booked';
