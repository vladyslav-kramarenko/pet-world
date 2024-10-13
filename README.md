# PetWorld: Find Your Next Furry Friend
Welcome to PetWorld, a project developed during the EPAM IT Marathon. This web application allows users to search for pets available for adoption, connecting people with pets to find their best friends. Built with modern technologies, this project focuses on user experience, flexibility, and scalability.

## About the Project
PetWorld is a web-based platform that allows users to find pets in need of a new family. Whether you're searching for a dog, cat, or another type of pet, this application enables users to browse pets by type and location. With the latest listings, detailed pet profiles, and advanced filters, PetWorld simplifies the process of finding your next furry friend.

### Project Context
This project was created as part of the EPAM IT Marathon 2024, an educational initiative organized by EPAM Systems. Participants in the marathon completed a series of workshops and tasks, building real-world projects using modern technology stacks.

### Key Features
* Pet Search: Search for pets based on type and province.
* Pet Profiles: View detailed profiles with pictures and information about each pet.
* User Authentication: Sign up, log in, and manage your user profile.
* Responsive Design: Optimized for both desktop and mobile devices.
* User Profile Management: Update your user information such as first name, last name, and email.

### Technologies Used
* Frontend: React, TypeScript, CSS
* Backend: AWS Lambda (serverless architecture)
* Database: DynamoDB
* Authentication: AWS Cognito
* Cloud Hosting: AWS S3 for static site hosting
* API Gateway: AWS API Gateway for handling HTTP requests
* Design: Styled with custom CSS for a seamless user experience

### Setup and Installation
To set up and run PetWorld locally, follow the steps below:

#### Clone the Repository:

```bash
Copy code
git clone https://github.com/your-repository/petworld.git
cd petworld
```

#### Install Dependencies:
```bash
Copy code
npm install
```


#### Run the Application Locally:
```bash
Copy code
npm start
```

#### Deploy Lambdas
This project includes several AWS Lambda functions located in the lambdas/ directory. You can deploy these Lambda functions using the AWS SAM CLI or other deployment methods supported by AWS.


#### Deploy to AWS (Optional)
If you wish to deploy the application to AWS, follow the instructions for using AWS CLI and AWS Amplify. Ensure you have the necessary credentials configured and a valid AWS account.

### How to Contribute
Feel free to fork this repository and submit pull requests with improvements, bug fixes, or new features! Contributions are always welcome.

## License
This project is licensed under the MIT License.
