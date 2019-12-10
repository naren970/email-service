var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Campaign Schema which will have saleId and EmailDevlivered
var CampaignsSchema = new mongoose.Schema({

  saleIdentifier :{
      type: String,
      //enum: ["SUMMER2019", "WINTER2019"],
  },
  isEmailDelivered:{
      type: Boolean
  },
  isEmailRead :{
      type: Boolean
  }
})

//User Schema will have following Fields
var UserSchema = new mongoose.Schema({

    firstName: {
      type: String,
      required: true,
      trim: true
     
    },
    lastName: {
      type: String,
      trim: true
    },
    emailId: {
      type: String,
      required: true,
      index: true,
      trim: true,
      unique: true
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    campaigns:[
      CampaignsSchema
    ]
  });
  

var Employee = mongoose.model('Users', UserSchema);
module.exports = Employee;
