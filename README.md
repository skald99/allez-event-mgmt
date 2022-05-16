# allez-event-mgmt
An Event Management Application for CS-554

# allez-event-mgmt
An Event Management Application for CS-554 Web Programming II. 

The course technologies used for this application are: React, Typescript, Firebase
Extra technologies used for this application are: StripeJS, Heroku

SetUp :

MongoDB Compass Connection
To connect to MongoDB compass locally, copy and paste the provided MONGO_URL in .env file

MongoDB Atlas Connection 


FireBase Initialization:
To connect to FireBase, the user has to be added as a member to the FireBase project group.
Afterwards, in the terminal the following commands have to be executed in the given order:
    npm install firebase-tools -g

    firebase login
The user has to allow collecting CLI usage
The user has to sign in with the email that has been used in order to be added in the firebase group

   firebase init	
Select "storage" (Firestore) in the given features. Use arrow keys to move the cursor up and down. 
Use spacebar to select a feature

    Select the default firebase project as allez-3e5a1 (Allez)	
    Select a file to use it for Storage Rules (Just choose storage.rules which will be overwritten with the same data).

PROVIDED FILES
    The user.json file will be provided which contains user emails and their corresponding passwords which can be used for testing.

    The firebase-private-key.json file will be provided along with .env file which has to be pasted in the project outside the client and server folders
