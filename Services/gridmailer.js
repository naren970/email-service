
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


/**
 * This Methode Will Take mailData as Param and get callback with result.
 * @param {*} mailData 
 * @param {*} callback 
 */
const gridMailer = function (mailData, callback){
    
    let toEmail = mailData.email;
    let saleId = mailData.saleId;
    let firstName = mailData.firstName;
    let lastName = mailData.lastName;
    //Default
    let templateId = "d-b077db629baa42b59090ab66d4df2976";
    if(saleId == "WINTER2019"){
        //WINTER2019
        templateId = "d-cc4a95b9533248ec84ea74e2f7ac0e53";
    }else{
        //SUMMER2020
        templateId = "d-b077db629baa42b59090ab66d4df2976";
    }
    console.log('Inside Mailer', toEmail);
    const msg = {
        to: toEmail,
        from: 'naren9701632117@gmail.com',
        templateId: templateId,
        dynamic_template_data: {
            //subject: 'Testing Templates & Stuff',
            firstName: firstName,
            lastName: lastName
          },
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail.send(msg, function(err, response){
        if(err){
            console.log('Error in Sending Email ', err);
            callback(err, null)
        }else{
            callback(null, response);
        }
      });

}

module.exports = {
    gridMailer
}