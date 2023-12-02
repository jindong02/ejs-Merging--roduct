const { ProductModel } = require('../../models/product');
const { uploadsFiles, deleteImage } = require('../../middlewares/filesUploads');

function uploadsMainProductImage(imgPaths, mainProductImage) {
  if (!imgPaths.length && !mainProductImage) throw new Error('You need to uploads an Image for your new Product'); // If Create New Product and Submit No Img
  if (!imgPaths.length && mainProductImage) return uploadsFiles(mainProductImage, 'product', true);
  if (imgPaths.length && mainProductImage) return uploadsFiles(mainProductImage, `./uploads${imgPaths[0]}`, false);

  return imgPaths[0];
}

function deleteAdditionnalImages(imgPaths, indexOfImageToDelete) {
  if (!indexOfImageToDelete) return imgPaths;

  for (let i = 0; i < 2; i++) {
    deleteImage(`./uploads${imgPaths[indexOfImageToDelete[i]]}`);
    imgPaths[indexOfImageToDelete[i]] = undefined;
  }

  return imgPaths.filter((element) => element);
}

function uploadsAdditionnalImages(imgPaths, secondaryProductImages) {
  if (!secondaryProductImages) return imgPaths;

  for (let i = 1; i < imgPaths.length; i++) {
    deleteImage(`./uploads${imgPaths[i]}`);
    imgPaths[i] = undefined;
  }

  imgPaths = imgPaths.filter((element) => element);

  for (let i = 0; i < secondaryProductImages.length; i++) {
    imgPaths.push(uploadsFiles([secondaryProductImages[i]], 'product', true));
  }

  return imgPaths;
}

const create = async (req, res) => {
  try {
    const {
      productImage,
      additionnalProductImage,
      deleteAdditionnalImg,
      title,
      description,
      message,
      price,
      shipFrom,
      allowHidden,
      qtySettings,
      shippingOptions,
      selection1,
      selection2,
      aboutProduct,
      productDetails,
      salesPrice,
      salesDuration,
      stopSales,
      status,
      customMoneroAddress,
    } = req.body;

    const { product } = req;

    const successMessage = product.title ? 'Product Successfully Edited' : 'Product Successfully Created';

    if (product.title !== title) {
      if (await ProductModel.findOne({ title, vendor: req.user.username })) throw new Error('You cant have the same title for multiple products');
    }

    // price
    if (stopSales) {
      product.endSales();
    } else if (!product.title) {
      product.price = price;
    } else if (!product.originalPrice && salesPrice) {
      product.startSales(salesPrice, salesDuration);
    } else {
      product.price = price;
    }

    // Title and Slug
    if (!product.title) product.createSlug(title, req.user.username); // Create Slug if Creating New Product
    if (product.title && product.title !== title) await product.changeSlug(title, product.vendor); // If Editing Product and Change Title, Change Slugs

    // Img Path
    product.img_path[0] = uploadsMainProductImage(product.img_path, productImage);

    // Delete Additionnal Product Img
    product.img_path = deleteAdditionnalImages(product.img_path, deleteAdditionnalImg);

    // Add new Additionnal Product Img
    product.img_path = uploadsAdditionnalImages(product.img_path, additionnalProductImage);

    product.title = title;
    product.vendor = req.user.username;
    product.description = description;
    product.productDetails = productDetails;
    product.aboutProduct = aboutProduct;
    product.message = message;
    product.ship_from = shipFrom;
    product.allow_hidden = allowHidden;
    product.selection_1 = selection1;
    product.selection_2 = selection2;
    product.shipping_option = shippingOptions;
    product.qty_settings = qtySettings;
    product.customMoneroAddress = customMoneroAddress;
    product.status = req.user.vendorMoneroAddress || product.customMoneroAddress ? status : 'offline';

    await product.save();

    if (product.status === 'offline') {
      if (status === 'online') req.flash('warning', 'You need to add a Monero Address to your account or a custom Monero address to the Product in order to put it online');
      else req.flash('warning', `${successMessage}, but still Offline`);
    } else {
      req.flash('success', `${successMessage}`);
    }

    res.redirect(`/user/profile/${req.user.username}?productPage=1&reviewPage=1`);
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect(`/user/profile/${req.user.username}?productPage=1&reviewPage=1`);
  }
};

module.exports = { create };
