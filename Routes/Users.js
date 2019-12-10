'use strict';

//Import Section
let path = require('path');
let ObjectId = require('mongoose').Types.ObjectId;
let mailer = require('../Services/gridmailer');
let UserSchema = require('../Schemas/UserSchema');


//Reguler Expression for Email validation
let regExpress = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//An Array of Sale Id's which we are Accepting 
let saledIds = ["WINTER2019", "SUMMER2020"];


module.exports = function(app, request, mongoose){

    /**
     * This API Will Accept the Body which Contains firstName, lastName, email, phone and saleId
     * Will return the status of Email Sent
     */
    app.post('/sendoffer', function(req, res){
        var body = req.body;
        console.log('The body ', body);
        //Validating the Body and Email Id
        if(body != null && regExpress.test(body.email)){

          //Validating Sale Id
          let saledIdIndex = saledIds.indexOf(body.saleId);
          if(saledIdIndex >= 0){
            console.log('Sale Id Found');

            isUserExist(body, function(err, userResult){
              //If Any Error 
              if(err ){
                  res.status(500).send(err);
              }//If No User Found
              else if(userResult.length == 0){
                console.log('Creating New User');
                //Creating New User
                createNewUser(body, function(err, result){
                  if(err){
                    console.log('Error in Creating User', err);
                    res.status(500).send(err);
                  }else{
                    console.log('Sucessfully Created New User');
                    //Sending Mail
                    mailer.gridMailer(body, function(err, mailerResult){
                      if(err){
                        console.log('Error in Sending Mailer',err);
                        res.send(err);
                      }else{
                        console.log('Email Sent Succesfully ', mailerResult);
                        res.send(mailerResult);
                      }
                    })
                  }
                })
              }//If User found 
              else if(userResult){
                console.log('Adding Saled Id to Campaign');
                //Adding Sale Id to Campaign List
                addSaleIdToCampaigns( body, function(err, salesCampaignResult){
                  if(err){
                    console.log('Error ', err);
                    res.send(err);
                  }else if(salesCampaignResult){
                    console.log('Sending An Email ');

                    //Sending Mail 
                    mailer.gridMailer(body, function(err, mailerResult){
                      if(err){
                        console.log('Error in Sending Mailer',err);
                        res.send(err);
                      }else{
                        console.log('Email Sent Succesfully ', mailerResult);
                        res.send(mailerResult);
                      }
                    })

                  }//User Has Already got Email with this Sale Id
                  else{
                    console.log("Email Already Sent with this Sale Id", err);
                      res.status(403).send({
                          status: 403,
                          message: "Email Already Sent with this Sale Id"
                      });
                  }
                })
              }
            })
          }else{
            console.log('Sale Id not found');
            res.status(400).send('Invalid Sale Id');
          }
  
        }else{
          console.log('Invalid Input or Email Id ');
          res.status(400).send('Invalid Input or Email');
        }
    })


    /**
     * This methode will take body as an argument and return result in callback
     * Will Check if User has mail already sent with Given Sale Id,
     * If User Schema Has SALE ID in Campaign Array , will return the message User already got the message.
     * If User Schema does not has SALE ID in Campaign array, will add to that array and send the mail
     * @param {*} body 
     * @param {*} callback 
     */
    function addSaleIdToCampaigns(body, callback){
      //Prepare Campaign Data
      let campaignData = {
        "saleIdentifier": body.saleId,
        "isEmailDelivered":false
      };

      //Check If User has already have SALE ID.
      UserSchema.find({"emailId": body.email, campaigns:{ $elemMatch: { saleIdentifier: body.saleId } }},function(err, saleIdResult){
          if(err){
            console.log('Error in Finding Sale Id', err);
            callback(err, null)
          }//User does not have Sale Id
          else if (saleIdResult.length == 0){
            UserSchema.findOneAndUpdate({"emailId": body.email}, {$push:{campaigns:campaignData}}, 
            function(err, updateResult){
              if(err){
                console.log('Error in Updating Campaigns Result ', err);
                callback(err, null);
              }else{
                console.log('Added Sales to Campaign');
                callback(null, updateResult);
              }
            })
          }//User has Sale Id
          else{
            console.log('Email Already sent with this Sale Id');
            callback(null, null);
          }   
      })      
    }


    /**
     * This methode will take body as an argument and return result in callback
     * This methose create New user with the sale id
     * @param {*} body 
     * @param {*} callback 
     */
    function createNewUser(body, callback){
      
      //Preparing the User Schema Data
      let userData = {
        "emailId": body.email,
        "firstName": body.firstName,
        "lastName": body.lastName,
        "phone":body.phone,
        "campaigns":[]
      }
      //Preparing the Campaign Data
      let campaignData = {
        "saleIdentifier": body.saleId,
        "isEmailDelivered":false
      };

      userData.campaigns.push(campaignData);
      let User = new UserSchema(userData);
      //Save User Data with Capmpaign 
      User.save(function(err, userSaveResult){
        if(err){
          console.log('Error in Createing User', err);
          callback(err, null);
        }else{
          console.log('User Created Succeesfully', userSaveResult);
          callback(null, userSaveResult);
        }
      })
    }


    /**
     * This methode will take body as an argument and return result in callback
     * This methode Check If User Exist or not 
     * @param {*} body 
     * @param {*} callback 
     */

    function isUserExist(body, callback){
      //Find the User by emailId
      UserSchema.find({"emailId": body.email}, function(err, userResult){
        if(err){
          console.log('Error in User Finding', err);
          callback(err, null);
        }else if(userResult){
          console.log('User Found' , userResult);
          callback(null, userResult);
        }
      })
    }
}
