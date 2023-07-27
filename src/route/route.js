const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const auth = require('../middleware/auth')

/*_____________________-----===> API FOR USER <====-----______________________________*/ 

router.post("/register", userController.createUser)
router.post("/login",userController.userLogin)
router.get('/user/:userId/profile',auth.userAuthentication, userController.getUserDetails)
router.put('/user/:userId/profile',auth.userAuthentication, userController.updateUserDetails)

/**______________________----==> PRODUCT API <===---____________________________________ */

router.post("/products", productController.createProduct)
router.get('/products',productController.getproducts)
router.get('/products/:productId',productController.getProductById)
router.put('/products/:productId',productController.updateProduct)
router.delete('/products/:productId',productController.deleteProduct)

/**________________________----===> CART API <====----________________________________________ */


module.exports = router;