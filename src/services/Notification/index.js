const NotificationAdminServices = require("./Admin.services");
const NotificationTypes = {
    Product: "product",
    Order: "order",
    Discount: "discount",
    System: "system" 
};

module.exports = { NotificationAdminServices, NotificationTypes };