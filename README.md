
# PeekSend

Suppose, you have applied for a job through an email. You have sent the email two days ago but you haven't gotten any response. And you don't know if the employer read your email or not. Well no need to worry now because I have a solution for that, introducing PeekSend.


## Introduction

PeekSend is an MIT Licensed open source project and a platform with the help of which you can find out if the Email sent by you has been read or not. It is a simple platform that has been designed by keeping the **user's privacy **in mind. We don't ask for full email read/write access. Instead, we provide a simple way to find the status if your email respecting your privacy.
## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Nhost


## Architecture

[![hasura-query-engine.png](https://i.postimg.cc/6QbmL1fP/hasura-query-engine.png)](https://postimg.cc/B8DpJpy5)


## Screenshots

[![Screenshot-2025-08-14-132338.png](https://i.postimg.cc/X76D859n/Screenshot-2025-08-14-132338.png)](https://postimg.cc/CdJNMzv2)

[![Screenshot-2025-08-14-132426.png](https://i.postimg.cc/g2NSmBQ0/Screenshot-2025-08-14-132426.png)](https://postimg.cc/21LFxTzp)

[![Screenshot-2025-08-14-132444.png](https://i.postimg.cc/XY7LHkq6/Screenshot-2025-08-14-132444.png)](https://postimg.cc/4mqpntpW)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NHOST_ADMIN_SECRET`

`NHOST_BACKEND_URL`

`REACT_APP_NHOST_SUBDOMAIN`

`REACT_APP_NHOST_REGION`


## Installation

Install my-project with npm



```bash

  Step 1: 
  Clone it

  Step 2:
  npm i
  npm run start
```

## Process

First of all, you need to create an account. Then only you can access your dashboard. Inside of your dashboard, you will see the list of emails you have sent and complete detail about them. If you haven't sent any emails then you can send one by clicking on compose button on the top left side of the page.

No, you can't send emails from here. Instead, you will be provided an image (1x1 transparent pixel) which you can copy and paste to the email client from where you are sending the email. Then fill out some more information about the email (it will make it easy to find the email in the future) and click save.

After you sent your email, you can now access the status of the email on the dashboard. The status is either seen or unseen. The status will be updated when the receiver opens up the email you sent. And the serverless function helps to do that by accepting the receiver's request and updating it on the database.
    
