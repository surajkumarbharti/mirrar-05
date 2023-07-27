
const productModel = require('../models/productModel')

const { isValid,isValidObjectId,isValidRequestBody,isValidScripts,validString,isValidNumber} = require('../validator/validator')

//const currencySymbol = require("currency-symbol-map")

const body = (ele) => {
    if (Object.keys(ele).length) return;
    return `Please send some valid data in request body`;
};

const check = (ele) => {
    if (ele == undefined) { return `is missing` }
    if (typeof ele != "string") { return `should must be a string` }
    // ele = ele.trim();
    if (!ele.length) { return `isn't valid` }
    if (ele.match("  ")) return `can't have more than one consecutive spaces'`;
};

const name = (ele) => {
    let regEx = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
    return regEx.test(ele);
  };



/////////////////////////////////////  CREATE PRODUCT ///////////////////////////////////////////////////////////

const createProduct = async function(req,res){

    try {
        
          let data = req.body;

          let message;
          if ((message = body(data))) { return res.status(400).send({ status: false, message: `${message}` }) };

          let { title, description,  currencyId, variant,price,
            style, availableSizes, } = data
            
             if(!(isValidNumber(typeof(price)) !== "Number")){
                 return res.status(400).send({status:false,msg:"price not a number"})
             }
       
          if((message = check(description))) {return res.status(400).send({status:false,message:`description ${message}`})}
          if((!name(description))) {return res.status(400).send({status:false,message:"invalid description"})}

        

          if((message = check(currencyId))) {return res.status(400).send({status:false,message:`currencyId ${message}`})}

          if(currencyId != "INR") return res.status(400).send({status:false, message: "it only take INR as currencyId"})


          if((message = check(style))) {return res.status(400).send({status:false,message:`style ${message}`})}

          if((!name(style))) {return res.status(400).send({status:false,message:"invalid style"})}


        if (!isValid(availableSizes)) {
            return res.status(400).send({ status: false, message: "Available Size is required" })
        }

        let sizes = availableSizes.split(",").map(x => x.trim())
        sizes.forEach((size) => {
              let arr = ["S", "XS","M","X", "L","XXL", "XL"]
          if (!arr.includes(size)) {return res.status(400).send({status: false,message: `availableSizes is required and can only have these values ${arr}`})}
            data.availableSizes = sizes
        })

    ////validation for variant

    if(!isValid(data.variant)){
        return res.status(400).send({status:false,msg:"variant is require"})
    }

          let productData = await productModel.create(data)
         return res.status(201).send({status:true, message:"product created successfully", data: productData})



        } catch (err) {
          return  res.status(500).send({ msg: err.message });
        }

}
/////////////////////////////// GET PRODUCT //////////////////////////////////////////////////////

const getproducts = async function (req, res) {
    try {
        let filter = req.query
        let Name = filter.title
        let size = filter.size
        let cost = filter.price
         const getproduct = { isDeleted: false };
        

        //Vaidation For Name
        if (!validString(Name)) {
            return res.status(400).send({ status: false, message: 'Please enter name' })
        }

        if (Name) {
            if (!isValid(Name)) {
                return res.status(400).send({ status: false, message: `User id ${Name} is not valid` })
            }
            getproduct["title"] = Name
        }

        //Validation For Size
        if (!validString(size)) {
            return res.status(400).send({ status: false, message: 'Please enter size' })
        }

        if (size) {
            if (isValid(size)) {
                var available = size.toUpperCase().split(",")
                for (let i = 0; i < available.length; i++) {
                    if (!(["S", "XS", "M", "X", "L", "XXL", "XL"]).includes(available[i])) {
                        return res.status(400).send({ status: false, message: `Sizes should be ${["S", "XS", "M", "X", "L", "XXL", "XL"]}` })
                    }


                }
            } else { return res.status(400).send({ status: false, message: `Sizes should be ${["S", "XS", "M", "X", "L", "XXL", "XL"]}` }) }
            getproduct["availableSizes"] = { $all: available }
        }

        // price validation
        if(cost){
            getproduct["price"] = cost
        }
        const findbyfilter = await productModel.find(getproduct).sort({price:1}).select({ _v: 0 })
          console.log(getproduct)

        //If product Document not found
        if (findbyfilter.length == 0) return res.status(404).send({ msg: "product not found" })
        return res.status(200).send({ msg: "All products", data: findbyfilter })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }

}
//////////////////////////////////// UPDATE PRODUCT //////////////////////////////////////////////////////

const updateProduct = async function (req, res) {

    try {
        const updatedData = req.body
        const productId = req.params.productId
        
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Invalid ProductId" })
        }

        const productData = await productModel.findById(productId)
        

        if (!productData) {
            return res.status(404).send({ status: false, message: "product not found" })
        }

        if (!isValidRequestBody(updatedData)) {
            return res.status(400).send({ status: false, message: "please provide product details to update" })
        }

        const { title, description, price, currencyId, style, availableSizes, } = updatedData

        if (title) {

            if (!isValid(title)) {
                return res.status(400).send({ status: false, message: `Title is required` })
            }

            const checkTitle = await productModel.findOne({ title: title });

            if (checkTitle) {
                return res.status(400).send({ status: false, message: ` Title is already used` })
            }

            productData.title = title

        }


        if (description) {

            if (!isValid(description)) {
                return res.status(400).send({ status: false, message: `Description is required` })
            }

            productData.description = description

        }


        if (price) {

            if (!isValid(price)) {
                return res.status(400).send({ status: false, message: `price is required` })
            }

            if (isNaN(Number(price))) {
                return res.status(400).send({ status: false, message: `Price should be a valid number` })
            }

            productData.price = price
        }

        if (currencyId) {

            if (!isValid(currencyId)) {
                return res.status(400).send({ status: false, message: `currencyId is required` })
            }

            if (currencyId != "INR") {
                return res.status(400).send({ status: false, message: 'currencyId should be a INR' })
            }

            productData.currencyId = currencyId;

        }


        if (style) {

            if (!isValid(style)) {
                return res.status(400).send({ status: false, message: `style is required` })
            }

            productData.style = style
        }

        if (availableSizes) {

            if (!isValid(availableSizes)) {
                return res.status(400).send({ status: false, message: `size is required` })
            }

            let sizes = availableSizes.split(",").map(x => x.trim())

        sizes.forEach((size) => {
              let arr = ["S", "XS","M","X", "L","XXL", "XL"]
          if (!arr.includes(size)) {return res.status(400).send({status: false,message: `availableSizes is required and can only have these values ${arr}`})}

            productData.availableSizes = sizes

            })
        }


       

      productData.save()

        return res.status(200).send({ status: true, message: 'Product details updated successfully.', data: productData });

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


//////////////////////////////////// GET BY ID /////////////////////////////////////////////////////////////////////

const getProductById = async function(req,res){
    try{

   let productId = req.params.productId

    if (!isValidObjectId(productId)) {return res.status(400).send({ status: false, message: "Invalid productId in path param" })}

    let findProduct = await productModel.findById({_id:productId})

    if(!findProduct) {return res.status(200).send({status:false, message: "No product exists with is Product id"})}

    if(findProduct.isDeleted) {return res.status(200).send({status:false, message: "product is already deleted"})}

    return res.status(200).send({ status: true, data: findProduct });

}catch(err){
    return res.status(500).send({ status: false, error: err.message });
}
}

 //////////////////////////////////    DELETE PRODUCT BY ID  ////////////////////////// 

const deleteProduct = async function (req, res) {
    try {

       let productId = req.params.productId

       if (!isValidObjectId(productId)) {return res.status(400).send({ status: false, message: "Invalid productId in path param" })}

        const product = await productModel.findById({ _id: productId })

        if (!product) {
            return res.status(400).send({ status: false, message: `Product not Found` })
        }
        if(product.isDeleted == true){
            return res.status(400).send({ status: false, message: `Product already deleted.` })
        }
        if (product.isDeleted == false) {
            await productModel.findOneAndUpdate({ _id: productId }, { $set: { isDeleted: true, deletedAt: new Date() } },{new:true})

            return res.status(200).send({ status: true, message: `Product deleted successfully.` })
        }
        return res.status(400).send({ status: true, message: `Product has been already deleted.` })



    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


module.exports.createProduct = createProduct
module.exports.getProductById=getProductById
module.exports.getproducts=getproducts
module.exports.deleteProduct = deleteProduct
module.exports.updateProduct=updateProduct
