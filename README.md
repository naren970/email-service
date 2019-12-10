# email-service
Huddle task

Deploying The Project : 

Download the Source Code from Below Link. 
https://github.com/naren970/email-service
Make Sure NodeJS 8 or  higher version installed in machine
Goto root directory of the project and install the dependencies 
cd email-service
npm install 
Run the Project using the below command. 
node index.js

How API Works:

This API will take the firstName, lastName, email, and saleId in request body and send you mail to user with the sale id. 
This API will work with two saleId for each user i.e SUMMER2020 & WINTER2019, if saleId is other than above two ids will give you Invalid Sale Id. 
If we try to hit the api with same sale Id twice it will give you message like "Email Already Sent with this Sale Id" with status 403

Internals of API:

	When Request received will check any user in DB, 
if user found, will check any email sent with sale Id, if not sent will add into user schema. 
If user not found, will create user schema with saleId.

MongoDB: Used MongoDB as Database and mongo atlas which is cloud solution for mongodb. 
 
Schema/UserSchema: Will Store the User data along with Sale Ids 
Routes/User: API Exposed to validate the business logic and 
Services/gridmailer: Mailer method has functionality to send the mail with templates.
index.js: All internals and mongodb configs are defined in this file.  
	


Accessing the API:
Request Via Postman : 

 We can access the API through Postman in following way


Methode : POST 
URL : http://<IP_ADDRESS>:8080/senddeals


Request Body : 
{
	"firstName":"Naren",
	"lastName": "Reddy",
	"email":"naren9701632117@gmail.com",
	"phone":"+919701632117",
	"saleId":"SUMMER2020"
}
Response Body:

RESPONSE1 : on success

[
    {
        "statusCode": 202,
        "headers": {
            "server": "nginx",
            "date": "Tue, 10 Dec 2019 18:06:06 GMT",
            "content-length": "0",
            "connection": "close",
            "x-message-id": "kXSwKCFFQziXGvBbKiPNvA",
            "access-control-allow-origin": "https://sendgrid.api-docs.io",
            "access-control-allow-methods": "POST",
            "access-control-allow-headers": "Authorization, Content-Type, On-behalf-of, x-sg-elas-acl",
            "access-control-max-age": "600",
            "x-no-cors-reason": "https://sendgrid.com/docs/Classroom/Basics/API/cors.html"
        },
        "request": {
            "uri": {
                "protocol": "https:",
                "slashes": true,
                "auth": null,
                "host": "api.sendgrid.com",
                "port": 443,
                "hostname": "api.sendgrid.com",
                "hash": null,
                "search": null,
                "query": null,
                "pathname": "/v3/mail/send",
                "path": "/v3/mail/send",
                "href": "https://api.sendgrid.com/v3/mail/send"
            },
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "User-agent": "sendgrid/6.4.0;nodejs",
                "Authorization": "Bearer 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",
                "content-type": "application/json",
                "content-length": 336
            }
        }
    },
    null
]


RESPONSE2: On Partial Success
 If we try to send API with Same Sale Id as twice we will get the following message.

{
    "status": 403,
    "message": "Email Already Sent with this Sale Id"
}

RESPONSE3: On Unauthorized Access:
If sendgrid apiKey is expired/If we don’t configure apiKey, we will get the following message.  
{
    "message": "Unauthorized",
    "code": 401,
    "response": {
        "headers": {
            "server": "nginx",
            "date": "Tue, 10 Dec 2019 13:55:47 GMT",
            "content-type": "application/json",
            "content-length": "88",
            "connection": "close",
            "access-control-allow-origin": "https://sendgrid.api-docs.io",
            "access-control-allow-methods": "POST",
            "access-control-allow-headers": "Authorization, Content-Type, On-behalf-of, x-sg-elas-acl",
            "access-control-max-age": "600",
            "x-no-cors-reason": "https://sendgrid.com/docs/Classroom/Basics/API/cors.html"
        },
        "body": {
            "errors": [
                {
                    "message": "Permission denied, wrong credentials",
                    "field": null,
                    "help": null
                }
            ]
        }
    }
}


Solution for Unauthorized Message from GridMailer.

 We have to create API key GridMailer website as followed in screen. And the environment variable 




Running the Application Using Docker Container:

Make sure Docker latest version installed in this System. 
Download the source code and build the docker image using docker file.

	Goto root directory of source code 
	cd email-service
	docker build -t naren-huddle-home-test/node-web-app .
	docker run -p -d 8080:8080  naren-huddle-home-test/node-web-app
	

	


