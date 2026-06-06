# Pet World: Serverless Web Application

> **🏆 Top Project Award Winner | EPAM IT Marathon 4.0**
> *Recognized as one of the best projects during a 60-hour engineering challenge.*
> 🔗 [View EPAM Campus Diploma](https://certificates.epam.com/certificates/34718b52-1fef-4ff1-add3-3d483a7f1e17)

## 📖 System Overview
Pet World is a fully serverless web application designed with a focus on high availability, scalable performance, and seamless user experience. Developed under strict time constraints, this project demonstrates a complete end-to-end cloud architecture, leveraging modern frontend frameworks and a robust decoupled AWS backend.

## 🏗️ Architecture & Tech Stack
This application was built utilizing a cloud-native, event-driven approach to minimize operational overhead and maximize scalability:

* **Frontend:** React, TypeScript, CSS
* **Compute & API Routing:** AWS Lambda, Amazon API Gateway
* **Database:** Amazon DynamoDB (NoSQL Data Management)
* **Storage & Hosting:** Amazon S3 (Static site hosting and scalable image storage)
* **Identity & Access Management:** Amazon Cognito

## ✨ Engineering Features
* **Serverless Backend:** RESTful APIs built with API Gateway and Lambda for efficient, on-demand execution.
* **DynamoDB Integration:** Fast and flexible CRUD operations managed through highly available NoSQL tables.
* **Secure Access:** User authentication, authorization, and profile management securely handled via Cognito.
* **Responsive UX/UI:** Advanced search and dynamic filtering capabilities built into a typed React frontend.

## 🚀 Local Development Setup

Clone the repository and install dependencies:
```bash
git clone [https://github.com/vladyslav-kramarenko/petworld.git](https://github.com/vladyslav-kramarenko/petworld.git)
cd petworld
npm install
```

Start the local development server:
```bash
npm start
```

Note: Backend deployment requires configured AWS credentials. Lambda functions located in the /lambdas directory are designed for deployment via the AWS SAM CLI.
