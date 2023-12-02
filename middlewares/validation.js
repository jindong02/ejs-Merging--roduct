const { BANNED_USERNAME } = require('../constants/bannedUsername');
const { ORDER_PRIVACY_TYPE } = require('../constants/orderPrivacyType');
const { CURRENCY_LIST } = require('../constants/currencyList');
const { COUNTRY_LIST } = require('../constants/coutryList');
const { POSSIBLE_RATING } = require('../constants/possibleRating');
const { isMoneroAddress, isEmail, isPgpKeys } = require('./function');

function filterEmpty(value) {
  return value.filter((element) => element);
}

function validateNumber(
  value,
  inputName,
  { min = 1, max = 1e6, isRequired = true } = {},
) {
  value = parseFloat(value);

  if (!isRequired && !value) return undefined;

  if (typeof value !== 'number' || isNaN(value)) throw new Error(`Invalid ${inputName} Data Type`);

  if (isRequired && !value) throw new Error(`The ${inputName} fields is Required`);
  if (value > max || value < min) {
    throw new Error(
      `The ${inputName} can have a value ranging from ${min} to ${max}`,
    );
  }

  return value;
}

function ValidateText(
  value,
  inputName,
  { minlength = 3, maxlength = 50, isRequired = true } = {},
) {
  if (!isRequired && !value) return undefined;

  if (typeof value !== 'string') throw new Error(`Invalid ${inputName} Data Type`);

  value = value.trim();

  if (isRequired && !value) throw new Error(`The ${inputName} fields is Required`);
  if (value.length > maxlength || value.length < minlength) {
    throw new Error(
      `The ${inputName} need to be within ${minlength} to ${maxlength} characters longs`,
    );
  }
  return value;
}

// Function
function validateShippingOption(shippingOptionDecription, shippingOptionPrice) {
  const returnShippingOptions = [];

  for (let i = 0; i < shippingOptionDecription.length; i++) {
    if (shippingOptionDecription[i]) {
      shippingOptionDecription[i] = ValidateText(
        shippingOptionDecription[i],
        `Shipping Option Description #${i + 1}`,
        { minlength: 0, maxlength: 200, isRequired: false },
      );

      shippingOptionPrice[i] = validateNumber(
        shippingOptionPrice[i],
        `Shipping Option Price #${i + 1}`,
        { min: 1, max: 1000, isRequired: false },
      );
      if (!shippingOptionPrice[i]) shippingOptionPrice[i] = 0;

      returnShippingOptions[i] = {
        option_description: shippingOptionDecription[i],
        option_price: shippingOptionPrice[i],
      };
    }
  }
  return returnShippingOptions;
}

function makeSelectionChoice(selectionOption, selectionPrice, selectionNum) {
  const selectionChoices = [];

  for (let i = 0; i < selectionOption.length; i++) {
    if (selectionOption[i]) {
      selectionOption[i] = ValidateText(
        selectionOption[i],
        `Selection ${selectionNum} Option Description #${i + 1}`,
        { minlength: 0, maxlength: 200, isRequired: false },
      );

      selectionPrice[i] = validateNumber(
        selectionPrice[i],
        `Selection ${selectionNum} Option Price #${i + 1}`,
        { min: -1000, max: 1000, isRequired: false },
      );
      if (!selectionPrice[i]) selectionPrice[i] = 0;

      selectionChoices[i] = {
        choice_name: selectionOption[i],
        choice_price: selectionPrice[i],
      };
    }
  }
  return selectionChoices;
}

function createSelection(
  selectionName,
  selectionOption,
  selectionPrice,
  selectionNum,
) {
  selectionName = ValidateText(
    selectionName,
    `Selection Name #${selectionNum}`,
    { minlength: 0, maxlength: 200, isRequired: false },
  );

  if (!selectionName) return undefined;

  const selectionChoice = makeSelectionChoice(
    selectionOption,
    selectionPrice,
    selectionNum,
  );

  if (!selectionChoice.length) return undefined;

  return { selection_name: selectionName, selection_choices: selectionChoice };
}

// Input Validation
function sanitizeLoginInput(req, res, next) {
  try {
    // Username
    req.body.username = ValidateText(req.body.username, 'Username', { minlength: 4, maxlength: 25 });

    // Password
    req.body.password = ValidateText(req.body.password, 'Password', {
      minlength: 8,
      maxlength: 200,
    });

    next();
  } catch (e) {
    req.flash('error', e.message);
    res.redirect(req.url);
  }
}
function sanitizeRegisterInput(req, res, next) {
  try {
    // Username
    req.body.username = ValidateText(req.body.username, 'Username', { minlength: 4, maxlength: 25 });
    if (BANNED_USERNAME.includes(req.body.username.toLowerCase())) throw new Error('You cannot use this Username');

    // Password
    req.body.password = ValidateText(req.body.password, 'Password', {
      minlength: 8,
      maxlength: 200,
    });

    // Confirm Password
    req.body.confirmPassword = ValidateText(
      req.body.confirmPassword,
      'Confirm Password',
      { minlength: 8, maxlength: 200 },
    );
    if (req.body.confirmPassword !== req.body.password) throw new Error('The Passwords doesnt Match');

    next();
  } catch (e) {
    req.flash('error', e.message);
    res.redirect(req.url);
  }
}

function sanitizeConversationInput(req, res, next) {
  try {
    // Message
    req.body.content = ValidateText(req.body.content, 'Message', { minlength: 2, maxlength: 1000 });

    if (req.body.displayUsername) req.body.displayUsername = ValidateText(req.body.displayUsername, 'Conversation Username', { minlength: 4, maxlength: 25 });

    switch (req.user.settings.messageSettings.conversationPgp) {
      case 'showPgp':
        req.body.conversationPgp = undefined;
        break;
      case 'dontShowPgp':
        req.body.conversationPgp = 'dontShowPgp';
        break;
      case 'customPgp':
        req.body.conversationPgp = isPgpKeys(req.body.customPgp);
        break;
    }

    next();
  } catch (e) {
    req.flash('error', e.message);
    res.redirect(`/user/profile/${req.params.username}?productPage=1&reviewPage=1`);
  }
}

function sanitizeHiddenConversationInput(req, res, next) {
  try {
    req.body.content = ValidateText(req.body.content, 'Message', { minlength: 2, maxlength: 1000 });
    req.body.conversationId = ValidateText(req.body.conversationId, 'Conversation Id', { minlength: 30, maxlength: 200 });
    req.body.conversationPassword = ValidateText(req.body.conversationPassword, 'Conversation Password', { minlength: 8, maxlength: 200 });
    req.body.confirmConversationPassword = ValidateText(req.body.confirmConversationPassword, 'Retyped Conversation Password', { minlength: 8, maxlength: 200 });

    if (req.body.conversationPassword !== req.body.confirmConversationPassword) throw Error('The Conversation Password Doesnt match');

    if (req.body.displayUsername) req.body.displayUsername = ValidateText(req.body.displayUsername, 'Conversation Username', { minlength: 4, maxlength: 25 });

    if (req.body.conversationPgp) req.body.conversationPgp = isPgpKeys(req.body.conversationPgp);
    else {
      switch (req.user.settings.messageSettings.conversationPgp) {
        case 'showPgp':
          req.body.conversationPgp = req.user.verifiedPgpKeys;
          break;
        default:
          req.body.conversationPgp = 'dontShowPgp';
          break;
      }
    }

    if (!['3', '7', '30', '180', '365'].includes(req.body.convoExpiryDate)) throw Error('Invalid Inactive Conversation Delete Value');
    if (!['never', '1', '3', '7', '30'].includes(req.body.messageExpiryDate)) throw Error('Invalid Mesasge Expiry Value');

    next();
  } catch (e) {
    req.flash('error', e.message);
    res.redirect(`/user/create-hidden-conversation?id=${req.params.id}`);
  }
}

function validateSectionCommand(input, splitedInput, { arrayLength = 3, hasPosition = true } = {}) {
  splitedInput[1] = parseFloat(splitedInput[1]);

  if (splitedInput.length !== arrayLength) return ['msg', input];
  if (hasPosition) {
    if (isNaN(splitedInput[1]) || typeof splitedInput[1] !== 'number' || splitedInput[1] < 0) return ['msg', input];
  }

  const returnedCommand = [splitedInput[0].toLowerCase(), splitedInput[1]];
  splitedInput[2] ? returnedCommand[2] = splitedInput[2] : undefined;

  return returnedCommand;
}

function extractCommand(input) {
  const splitedContent = input.split('/');

  if (splitedContent.length === 1) return ['msg', input];

  splitedContent[0] = splitedContent[0].toLowerCase();

  if (splitedContent[0] === 'msg') return ['msg', splitedContent[2]];
  if (splitedContent[0] === 'delete') return validateSectionCommand(input, splitedContent, { arrayLength: 2 });
  if (['edit', 'reply'].includes(splitedContent[0])) return validateSectionCommand(input, splitedContent);

  return ['msg', input];
}

function sanitizeMessageInput(req, res, next) {
  try {
    req.query.msgIndex = parseFloat(req.query.msgIndex);

    if (!isNaN(req.query.msgIndex)) {
      switch (req.query.action) {
        case 'edit':
        case 'reply':
          req.body.content = `${req.query.action}/${req.query.msgIndex}/${req.body.content}`;
          break;
        case 'delete':
          req.body.content = `${req.query.action}/${req.query.msgIndex}`;
          break;
      }
    }

    // COMMAND/POSITION/*Content
    req.body.content = ValidateText(req.body.content, 'Message', { minlength: 2, maxlength: 1000 });

    req.body.command = extractCommand(req.body.content);

    next();
  } catch (e) {
    res.redirect('/user/messages#bottom');
  }
}

function sanitizeReviewInput(req, res, next) {
  try {
    req.body.review = ValidateText(req.body.review, 'Review', {
      minlength: 5,
      maxlength: 5000,
    });

    if (!POSSIBLE_RATING.includes(req.body.note)) throw new Error();

    if (!['default', 'semi-hidden', 'hidden'].includes(req.body.type)) throw new Error();

    next();
  } catch (e) {
    res.redirect('/404');
  }
}

function sanitizeProfileInput(req, res, next) {
  try {
    req.body.job = ValidateText(req.body.job, 'Job', {
      minlength: 0,
      maxlength: 100,
      isRequired: false,
    });

    req.body.description = ValidateText(req.body.description, 'Description', {
      minlength: 0,
      maxlength: 3000,
      isRequired: false,
    });

    if (req.body.achievement) {
      req.body.achievement = filterEmpty(req.body.achievement);
      for (let i = 0; i < req.body.achievement.length; i++) {
        req.body.achievement[i] = ValidateText(
          req.body.achievement[i],
          `Achievement #${i}${1}`,
          { minlength: 0, maxlength: 50, isRequired: false },
        );
      }
    } else req.body.achievement = undefined;

    if (req.body.languages) {
      req.body.languages = filterEmpty(req.body.languages);
      for (let i = 0; i < req.body.languages.length; i++) {
        req.body.languages[i] = ValidateText(
          req.body.languages[i],
          `Languages #${i}${1}`,
          { minlength: 0, maxlength: 50, isRequired: false },
        );
      }
    } else req.body.languages = undefined;

    next();
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/user/profile/edit?productPage=1&reviewPage=1');
  }
}

function sanitizeProductInput(req, res, next) {
  try {
    // Title
    req.body.title = ValidateText(req.body.title, 'Title', {
      minlength: 5,
      maxlength: 250,
    });

    // Description
    req.body.description = ValidateText(req.body.description, 'Description', {
      minlength: 10,
      maxlength: 20000,
    });

    // Message
    req.body.message = ValidateText(req.body.message, 'Message', {
      minlength: 0,
      maxlength: 1000,
      isRequired: false,
    });

    // Allow Hidden
    req.body.allowHidden = req.body.allowHidden ? true : undefined;

    // Ship From
    if (!COUNTRY_LIST.includes(req.body.shipFrom)) throw new Error('Selected Country Invalid');

    //
    if (!CURRENCY_LIST.includes(req.body.currency)) throw new Error('Selected Currency Invalid');

    // Details
    if (req.body.aboutProduct) {
      req.body.aboutProduct = filterEmpty(req.body.aboutProduct);
      for (let i = 0; i < req.body.aboutProduct.length; i++) {
        req.body.aboutProduct[i] = ValidateText(
          req.body.aboutProduct[i],
          `About Product #${i}${1}`,
          { minlength: 0, maxlength: 175, isRequired: false },
        );
      }
    } else req.body.aboutProduct = undefined;

    const productDetails = [];
    for (let i = 0; i < req.body.productDetails.length; i++) {
      req.body.productDetails[i] = ValidateText(
        req.body.productDetails[i],
        `Product Details #${i}${1}`,
        { minlength: 0, maxlength: 250, isRequired: false },
      );
      req.body.productDetailsDescription[i] = ValidateText(
        req.body.productDetailsDescription[i],
        `Product Details Description #${i}`,
        { minlength: 0, maxlength: 500, isRequired: false },
      );

      if (req.body.productDetails[i] && req.body.productDetailsDescription[i]) {
        productDetails.push({
          details: req.body.productDetails[i],
          detailsDescription: req.body.productDetailsDescription[i],
        });
      } else req.body.productDetails.splice(i, 1);
    }

    req.body.productDetails = productDetails;

    // Custom Monero Address
    req.body.customMoneroAddress = req.body.customMoneroAddress
      ? isMoneroAddress(req.body.customMoneroAddress, 'Custom')
      : undefined;

    // Availble Quantity
    req.body.qtySettings = validateNumber(req.body.qtySettings, 'Available', {
      min: 1,
      max: 1000,
      isRequired: false,
    });

    req.body.max_order = validateNumber(
      req.body.max_order,
      'Maximun per Order',
      {
        min: 1,
        max: req.body.qtySettings ? req.body.qtySettings : 1000,
        isRequired: false,
      },
    );

    // Quantity Settings
    req.body.qtySettings = {
      available_qty: req.body.qtySettings,
      max_order: req.body.max_order,
    };

    // Shipping Option
    req.body.shippingOptions = validateShippingOption(
      req.body.describe_ship,
      req.body.price_ship,
    );

    // Selection #1
    req.body.selection1 = createSelection(
      req.body.selection_1_name,
      req.body.se_1_des,
      req.body.se_1_price,
      1,
    );

    // Selection #2
    req.body.selection2 = createSelection(
      req.body.selection_2_name,
      req.body.se_2_des,
      req.body.se_2_price,
      2,
    );

    // Price
    req.body.price = validateNumber(req.body.price, 'Price');

    if (req.product.salesPrice && req.product.price !== req.body.price) {
      throw new Error(
        'You cant change the Price of your Product while it is still on sale',
      );
    }

    req.body.salesPrice = validateNumber(req.body.salesPrice, 'Sales Price', {
      min: 1,
      max: req.body.price - 1,
      isRequired: false,
    });

    req.body.salesDuration = req.body.salesDuration
      ? validateNumber(req.body.salesDuration, 'Sales Duration', {
        min: 1,
        max: 30,
        isRequired: false,
      })
      : 1;

    if (req.product.salesPrice) {
      if (req.product.salesPrice !== req.body.salesPrice) {
        throw new Error(
          'You cant change the Price of your Sales while on Sales',
        );
      }
      if (req.product.salesDuration !== req.body.salesDuration) {
        throw new Error(
          'You cant change the Duration of your Sales while on Sales',
        );
      }
      req.body.stopSales = !!req.body.stopSales;
    }

    if (req.body.deleteAdditionnalImg) {
      if (typeof req.body.deleteAdditionnalImg === 'string') {
        if (
          req.body.deleteAdditionnalImg !== '1'
          && req.body.deleteAdditionnalImg !== '2'
        ) {
          throw new Error('Invalid Image to Delete');
        }
        req.body.deleteAdditionnalImg = [req.body.deleteAdditionnalImg];
      } else {
        if (
          req.body.deleteAdditionnalImg[0] !== '1'
          && req.body.deleteAdditionnalImg[0] !== '2'
        ) {
          throw new Error('Invalid Image to Delete');
        }
        if (
          req.body.deleteAdditionnalImg[1] !== '1'
          && req.body.deleteAdditionnalImg[1] !== '2'
        ) {
          throw new Error('Invalid Image to Delete');
        }
      }
    } else req.body.deleteAdditionnalImg = undefined;

    // Status
    if (!['online', 'offline'].includes(req.body.status)) throw new Error('Invalid Status Value');

    next();
  } catch (e) {
    console.log(e);
    const url = `${req.url}`;

    req.flash('error', e.message);
    res.redirect(url);
  }
}

function sanitizeChangePassword(req, res, next) {
  try {
    // Old Password
    req.body.password = ValidateText(req.body.password, 'Password', {
      minlength: 8,
      maxlength: 200,
    });

    // New Password
    req.body.newPassword = ValidateText(req.body.newPassword, 'New Password', {
      minlength: 8,
      maxlength: 200,
    });

    // Confirm Password
    req.body.confirmPassword = ValidateText(
      req.body.confirmPassword,
      'Confirm New Password',
      { minlength: 8, maxlength: 200 },
    );
    if (req.body.confirmPassword !== req.body.newPassword) throw new Error('The new Password doesnt Match');

    next();
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/user/settings/security');
  }
}

function sanitizeVerificationCode(req, res, next) {
  try {
    const lengths = req.query.type === 'email' ? [9, 9] : [9, 300];

    req.body.code = ValidateText(req.body.code, 'Code', {
      minlength: lengths[0],
      maxlength: lengths[1],
    });

    next();
  } catch (e) {
    req.flash('error', e.message);
    res.redirect(`/2fa?type=${req.query.type}`);
  }
}

function validateContactUs(req, res, next) {
  try {
    req.body.username = req.body.username ? req.user.username : undefined;

    if (!['feedback', 'bug', 'help', 'other'].includes(req.body.reason)) throw new Error('Invalid Reason');

    req.body.message = ValidateText(req.body.message, 'Message', {
      minlength: 10,
      maxlength: 3000,
    });

    if (req.body.email) {
      if (!isEmail(req.body.email)) throw new Error('The Email field must be a valid Email');
    } else req.body.email = undefined;

    next();
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/contactus');
  }
}

function validateResolveReport(req, res, next) {
  try {
    req.body.message = ValidateText(req.body.message, 'Message to the vendor', {
      minlength: 10,
      maxlength: 3000,
    });

    if (req.body.banReason) {
      req.body.banReason = ValidateText(
        req.body.banReason,
        'Reason of Banning',
        { minlength: 10, maxlength: 3000 },
      );
    } else {
      req.body.banReason = undefined;
    }

    next();
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/reports');
  }
}

function validateReports(req, res, next) {
  try {
    req.body.username = req.body.username ? req.user.username : undefined;

    if (
      !['scam', 'blackmail', 'information', 'other'].includes(req.body.reason)
    ) throw new Error('Invalid Reason');

    req.body.message = ValidateText(req.body.message, 'Message', {
      minlength: 10,
      maxlength: 3000,
    });

    req.params.id = ValidateText(req.params.id, 'Id', {
      minlength: 3,
      maxlength: 200,
    });

    next();
  } catch (e) {
    console.log(e);
    res.redirect('/404');
  }
}

// Make Order Validation
function isShippingOptionValid(shippingOption, availableShippingOption) {
  for (let i = 0; i < availableShippingOption.length; i++) {
    if (shippingOption === availableShippingOption[i].option_description) {
      return {
        optionName: availableShippingOption[i].option_description,
        optionPrice: availableShippingOption[i].option_price,
      };
    }
  }

  throw new Error('Invalid Selected Shipping Option');
}

function isSelectionValid(selectedSelection, availableSelection) {
  for (let i = 0; i < availableSelection.selection_choices.length; i++) {
    if (
      selectedSelection === availableSelection.selection_choices[i].choice_name
    ) {
      return {
        selectionName: availableSelection.selection_name,
        selectedChoice: {
          choiceName: availableSelection.selection_choices[i].choice_name,
          choicePrice: availableSelection.selection_choices[i].choice_price,
        },
      };
    }
  }
  throw new Error('Invalid Selected Selection');
}

function maxQuantity(maxPerOrder, availableQuantity) {
  if (maxPerOrder) {
    if (maxPerOrder < availableQuantity) return availableQuantity;
    return maxPerOrder;
  }
  if (availableQuantity) return availableQuantity;
  return 1000;
}

async function sanitizeOrderCustomization(req, res, next) {
  try {
    if (req.user.username === req.product.vendor) throw new Error('You cant Buy Your Own Product');
    if (req.product.available_qty == 0) throw new Error('This Product is Sold Out');

    if (!Object.values(ORDER_PRIVACY_TYPE).includes(req.body.privacyType)) throw new Error('Invalid Privacy Settings');

    if (!req.body.quantity) req.body.quantity = 1;
    else {
      req.body.quantity = validateNumber(req.body.quantity, 'Quantity', {
        max: maxQuantity(
          req.product.qty_settings.max_order,
          req.product.qty_settings.available_qty,
        ),
      });
    }

    // Shipping Option
    if (req.body.shippingOption) {
      req.body.chosenShippingOption = isShippingOptionValid(
        req.body.shippingOption,
        req.product.shipping_option,
      );
    }

    // Selection #1
    if (req.body.selection1 && req.product.selection_1) {
      req.body.chosenSelection1 = isSelectionValid(
        req.body.selection1,
        req.product.selection_1,
      );
    }

    // Selection #2
    if (req.body.selection2 && req.product.selection_2) {
      req.body.chosenSelection2 = isSelectionValid(
        req.body.selection2,
        req.product.selection_2,
      );
    }

    next();
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect(`/order/${req.params.slug}`);
  }
}

function isObject(value) {
  if (value instanceof Object) {
    if (value instanceof Array) return undefined;
    return true;
  }
  return undefined;
}

function sanitizeInput(value) {
  if (!value) throw new Error();
  if (typeof value !== 'string') throw new Error();
  if (value.length > 250) throw new Error();
}

function sanitizeObject(object) {
  if (!isObject(object)) throw new Error();

  const querysValues = Object.keys(object);

  for (let i = 0; i < querysValues.length; i++) {
    sanitizeInput(object[querysValues[i]]);
  }
}

function sanitizeQuerys(req, res, next) {
  try {
    if (req.query) sanitizeObject(req.query);

    next();
  } catch (e) {
    console.log('Invalid Query');
    res.redirect('/404');
  }
}

function sanitizeParams(req, res, next) {
  try {
    if (req.params) sanitizeObject(req.params);

    next();
  } catch (e) {
    console.log('Invalid Params');
    res.redirect('/404');
  }
}

function sanitizeParamsQuerys(req, res, next) {
  try {
    sanitizeObject(req.query);
    sanitizeObject(req.params);

    next();
  } catch (e) {
    console.log('Invalid Query or Params');
    res.redirect('/404');
  }
}

function validateMessageSettings(req, res, next) {
  try {
    req.body.includeTimestamps = !!req.body.includeTimestamps;
    req.body.messageView = !!req.body.messageView;
    req.body.deleteEmpty = !!req.body.deleteEmpty;

    if (!['generateRandom', 'customUsername', 'ownUsername'].includes(req.body.displayUsername)) throw Error('Invalid Conversation Username Value');
    if (!['showPgp', 'dontShowPgp', 'customPgp'].includes(req.body.conversationPgp)) throw Error('Invalid Conversation Pgp Value');
    if (!['', '1', '3', '7', '30'].includes(req.body.messageExpiryDate)) throw Error('Invalid Conversation Message Expiring Value');
    if (!req.body.messageExpiryDate) req.body.messageExpiryDate = undefined;

    if (!['', '3', '7', '30', '180', '360'].includes(req.body.convoExpiryDate)) throw Error('Invalid Conversation Expiring Value');
    if (!req.body.convoExpiryDate) req.body.convoExpiryDate = undefined;

    req.body.customUsername = req.body.customUsername && req.body.displayUsername === 'customUsername' ? ValidateText(req.body.customUsername, 'Custom Username', { minlength: 4, maxlength: 25 }) : undefined;
    req.body.customPgp = req.body.customPgp && req.body.conversationPgp === 'customPgp' ? isPgpKeys(req.body.customPgp) : undefined;

    next();
  } catch (e) {
    console.log(e);
    req.flash('error', e.message);
    res.redirect('/user/settings/privacy');
  }
}
function changeUserSettingsConversation(req, res, next) {
  try {
    if (!['never', '1', '3', '7', '30'].includes(req.body.messageExpiryDate)) throw Error('Invalid Conversation Message Expiring Value');

    if (!['showPgp', 'dontShowPgp', 'customPgp'].includes(req.body.conversationPgp)) throw Error('Invalid Conversation Pgp Value');

    if (req.body.conversationPgp === 'customPgp') {
      if (req.body.customPgp) req.body.conversationPgp = isPgpKeys(req.body.customPgp);
      else if (req.user?.settings.messageSettings.customPgp) req.body.conversationPgp = req.user.settings.messageSettings.customPgp;
    }

    next();
  } catch (e) {
    console.log(e);
    res.redirect(`messages?id=${req.params.id}#bottom`);
  }
}
function changeSettingsConversation(req, res, next) {
  try {
    req.body.includeTimestamps = req.body.includeTimestamps ? true : undefined;
    req.body.messageView = req.body.messageView ? true : undefined;
    req.body.deleteEmpty = req.body.deleteEmpty ? true : undefined;

    if (!['', '3', '7', '30', '180', '365'].includes(req.body.convoExpiryDate)) throw Error('Invalid Conversation Expiring Value');

    next();
  } catch (e) {
    console.log(e);
    res.redirect(`messages?id=${req.params.id}#bottom`);
  }
}

function sanitizeSearchInput(req, res, next) {
  try {
    req.body.search = ValidateText(req.body.search, 'Search Input', { minlength: 2, maxlength: 500 });

    const splitedSearch = req.body.search.split('/');

    if (splitedSearch.length === 2) req.body.searchInput = splitedSearch;
    else req.body.searchInput = [req.body.search, undefined];

    next();
  } catch (e) {
    console.log(e);
    res.redirect(`messages?id=${req.params.id}#bottom`);
  }
}

function validateNotificationSettings(req, res, next) {
  try {
    req.body.recordNotification = req.body.recordNotification ? true : undefined;

    if (req.body.recordNotification) {
      req.body.seen = req.body.seen ? true : undefined;
      if (!['', '1', '3', '7', '30', '-1', undefined].includes(req.body.expiryDateNotification)) throw Error('Invalid Notification Expiring Value');

      req.body.sendNotification = {
        orderStatusChange: !!req.body.orderStatusChange,
        newConversation: !!req.body.newConversation,
        newMessage: !!req.body.newMessage,
        changeConversationSettings: !!req.body.changeConversationSettings,
        deleteMessage: !!req.body.deleteMessage,
        deleteConversation: !!req.body.deleteConversation,
        newUpdate: !!req.body.newUpdate,
      };
    }

    next();
  } catch (e) {
    console.log(e);
    res.redirect('/user/settings/privacy');
  }
}

module.exports = {
  isObject,
  sanitizeSearchInput,
  changeUserSettingsConversation,
  validateNotificationSettings,
  sanitizeHiddenConversationInput,
  changeSettingsConversation,
  validateMessageSettings,
  sanitizeQuerys,
  sanitizeParams,
  sanitizeParamsQuerys,
  sanitizeOrderCustomization,
  validateReports,
  validateResolveReport,
  validateContactUs,
  sanitizeVerificationCode,
  sanitizeChangePassword,
  sanitizeProductInput,
  sanitizeProfileInput,
  sanitizeReviewInput,
  sanitizeMessageInput,
  sanitizeConversationInput,
  sanitizeRegisterInput,
  sanitizeLoginInput,
};
