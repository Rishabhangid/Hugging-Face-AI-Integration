const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser"); // passing cookie between both end

const {testingRoute} = require("../routecontroller/routefunction"); // importing routing functions
router.use(cookieParser());
router.use(express.json());

// **********************************************************************************************   TESTING ROUTE
router.get("/test", testingRoute);

module.exports = router; //exporting to use in index.js