  import Product from "../models/productModel.js"

  const createProduct=async(req,res)=>{

    try{
        const {name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            brand,
            sizes,
            colors,
            collection,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight

        } = req.body

        
        const product=new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            brand,
            sizes,
            colors,
            collection,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            user:req.user._id
    })


    const createProduct=await product.save()
    res.status(201)
    .json({
        success:true,
        message:"product created successfully",
        product:createProduct
    })


    }
    catch(err){
      console.log(err);
      res.status(500)
      .json({
        success:false,
        message:"something went wrong"
      })
    }


  }


  // update the product

  const updateProduct=async(req,res)=>{
    try{
         const {name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            brand,
            sizes,
            colors,
            collection,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight

        } = req.body

        // find the product im database

        const product=await Product.findById(req.params.id)

        if(product){

            product.name=name || product.name
            product.description=description || product.description
            product.price=price || product.price
            product.discountPrice=discountPrice || product.discountPrice
            product.countInStock=countInStock || product.countInStock
            product.sku=sku || product.sku
            product.category=category || product.category
            product.brand=brand || product.brand
            product.sizes=sizes || product.sizes
            product.colors=colors || product.colors
            product.collection=collection || product.collection
            product.material=material || product.material
            product.gender=gender || product.gender
            product.images=images || product.images
            product.isFeatured=isFeatured !==undefined ? isFeatured : product.isFeatured
            product.isPublished=isPublished !==undefined ? isPublished : product.isPublished
            product.tags=tags || product.tags
            product.dimensions=dimensions || product.dimensions
            product.weight=weight || product.weight


            const updatedProduct=await product.save()
            res.status(200)
            .json({
                success:true,
                message:"product updated successfully",
                product:updatedProduct
            })
            
        }


        


    }
    catch(error){
        console.log(error)
        res.status(500)
        .json(
            {
                message:"something went wrong"
            }
        )

    }

  }

  // delete the product

  const deleteProduct=async(req,res)=>{

    try{
        const product=await Product.findById(req.params.id)
        if(product){
            await product.deleteOne()
            res.status(200)
            .json({
                success:true,
                message:"product deleted successfully"
            })
        }
        else{
            res.status(404)
            .json({
                success:false,
                message:"product not found"
            })
        }



    }
    catch(error){
        console.log(error)
        res.status(500)
        .json(
            {
                message:"something went wrong"
            }
        )

  }
}


const getAllProduct =async(req,res)=>{
    try{
        const {collection,sizes,colors,brand,gender,minPrice,maxPrice,sortBy,search,category,material,limit}=req.query
          
        let query={}

        if(collection && collection.toLocaleLowerCase !=="all"){
            query.collection=collection
        }
        if(category && category.toLocaleLowerCase !=="all"){
            query.category=category
        }
        if(material){
            query.material={$sin:material.split(",")}
        }
         if(brand){
            query.brand={$sin:brand.split(",")}
        }
         if(sizes){
            query.sizes={$sin:sizes.split(",")}
        }
         if(colors){
            query.colors={$in:[colors]}
        }
        if(gender){
            query.gender=gender
        }
        if(minPrice || maxPrice){
            query.price={}
            if(minPrice) query.price.gte=Number(minPrice)
            if(maxPrice) query.price.lte=Number(maxPrice)
        }

        if(search){
            query.$or=[
                {name:{$regex:search,$options:"i"}},
                {description:{$regex:search,$options:"i"}}
            ]
              
            
           
        }

        const products=await Product.find(query)
        .sort({[sortBy]:-1})
        .limit(Number(limit))
        res.status(200)
        .json({
            success:true,
            message:"products fetched successfully",
            products
        })

        
         



      
}
    catch(error){
        console.log(error);
        res.status(500)
        .json({
            message:"something went wrong"
        })
    }

}

// display the best seller

const bestSeller=async(req,res)=>{
    try{
      
        const bestSeller=await Product.findOne().sort({ratings:-1})
        if(bestSeller){
            res
            .json(
                bestSeller
            )
        }
        else{
            res.status(404)
            .json({
                success:false,
                message:"best seller not found"
            })
        }
     
    }
    catch(error){
        console.log(error);
        res.status(500)
        .json({
            message:"something went wrong"
        })
    
    } 

  }

  // display the new arrivals


  const newArrival=async(req,res)=>{
    try{
        // find talest 8 products
        const newArrival=await Product.find().sort({createdAt:-1}).limit(8)
         
        res.status(200)
        .json({
            success:true,
            message:"new arrival fetched successfully",
            newArrival
        })

    }
    catch(error){
        res.status(500)
        .json({
            message:"something went wrong"
        })
    }
}





const singleProduct=async(req,res)=>{
    try{
        const product=await Product.findById(req.params.id)
        if(product){
            res.status(200)
            .json({
                success:true,
                message:"product fetched successfully",
                product
            })
        }
        else{
            res.status(404)
            .json({
                success:false,
                message:"product not found"
            })
        }


    }
    catch(error){
        console.log(error);
        res.status(500)
        .json({
            message:"something went wrong"
})
    }
}

// similar products

  const similarProduct=async(req,res)=>{
     const {id}=req.params

     console.log(id);
     try{

        const product=await Product.findById(id)
           if(!product){
            res.status(404)
            .json({
                success:false,
                message:"product not found"
            })
           }
           const similarProducts=await Product.find({
            category:product.category,
            _id:{$ne:id},
            gender:product.gender
           }).limit(4)
           res.status(200)
           .json({
            success:true,
            message:"similar products fetched successfully",
            similarProducts
           })
           
     }
     catch(error){
        console.log(error);
        res.status(500)
        .json({
            message:"something went wrong"
})
     }


  }

  // best seller

  












  export {createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    singleProduct,
    similarProduct,
    bestSeller,
    newArrival
}