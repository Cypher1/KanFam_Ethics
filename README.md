# KanFam Ethics
## An organisational tool for everyone

KanFam uses is written in JavaScript using a Meteor stack.

- Documentation for Meteor
    - https://docs.meteor.com/
- Documentation for npm
    - https://docs.npmjs.com
- Github for FlowRouter
    - https://github.com/kadirahq/flow-router
- Github for BlazeLayout
    - https://github.com/kadirahq/blaze-layout

### Getting Started

- Install meteor https://www.meteor.com/install
- Get a copy of the repo with
    ```
    git clone https://github.com/Cypher1/KanFam_Ethics.git
    ```
- Start meteor with
    ```
    meteor
    ```

### Project Structure
- /imports
    - /api
    - /ui
        - Base code for generating every page
        - /templates
        - /pages
    - /startup
        - Code for setting up the server (that the client can access)
- /client
    - Code that sets up the server
- /server
    - Code for setting up the server
- /public
    - Static files
- /node\_modules
    - Modules that meteor imports from npm
- /package.json
    - Settings for npm (allows npm start)
