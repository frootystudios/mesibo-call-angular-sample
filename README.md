# Mesibo Call Sample for Angular

Mesibo offers everything to make your app real-time and scalable for your first billion users and the next. It's modular, lightweight and easy to integrate.

To know more about mesibo please visit https://mesibo.com/


# Steps to Configure
Create account on Mesibo by visiting https://mesibo.com/console/#/register link. Its free!

After completing the registration and process instructed to verify the account, Please login to your Mesibo Account.
On Dashboard (https://mesibo.com/console/#/dashboard) you will informations like MAU, API Credencials, My Applications, Account Summary, etc.

Lets create an Application on Mesibo by clicking "Create New Application" button.
You will need to provide an Application Name, you can provide any name there. Lets assume you used "MesiboSampleApp" as app name.

Now click on "MesiboSampleApp" listed in the "My Application" section of Dashboard or you can click on the setting icon in that row.

Now you will see setting for your created application. Please go to "Users" tab and create two users.
lets assume you have created two user with User address "firstuser@yopmail.com" and "seconduser@yopmail.com".

You can access each created users access token by clicking on Edit Icon listed in "Action" column.
When you click on Edit icon you can see "Auth Token" on it which is the Access token which we are going to use in our Sample Application.

Open Sample Project in any IDE you prefer.

Now open file with name "app.component.ts" and locate "user1Details" and "user2Details" class variables, provide Access token and Email Address to respective placeholders.

Now open file with name "mesibo.service.ts" file and change "appId" variable's placefolder with the App ID mentioned on Mesibo Application Setting's "General" tab.


# Run Application
After completing configuration time to run this sample project.
First execute following command on projects root folder to install all libraries
/> npm install

To run application on local network use following command
/> ng serve --host 0.0.0.0 --ssl

To run application on VPS use following command
/> ng serve --host 0.0.0.0 --ssl --disableHostCheck true

After application successfully running. Use following steps to your first Mesibo start Video Call.
Step 1: From Machine 1 click on "Connect Using User 1", wait for the connection status to be "Online"
Step 2: From Machine 2 Click on "Connect Using User 2", wait for the connection status to be "Online"
Step 3: Now to start video call, assuming calling from Machine 1, click on "Start Video Call to User 2" and give permission for Camera and Microphone.
Step 4: On Machine 2 it will ask for Camera and Microphone permission, After you can see message on Machine 2 "Incoming Call Status : Incoming Call" then press "Answer Call" button.

That's it.. now both machine should be able to do Video Call!

To Know more about the code please refer the comments in code.

# Extra Information
Mesibo also provide On-Premises facility using which you can install it on your own server or VPS.
You can do On-Premise deployement by following https://mesibo.com/documentation/on-premise/ steps.

And you can use same sample application to test its working.