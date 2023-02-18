# Cassandra schema parser

## To start the app accomplish following steps:

### 1. <code>npm i</code>

### 2. Fill .env file with appropriate environment variables.

If you have a local connection:

    My setup was: Cassandra v3.11.14, Java v8.0.251, Python v2.7.18

If you have a remote DataStax Astra cluster:

    When creating a cluster save your credentials and fill environmantal variables with them.

    On the page of your cluster on "Connection" tap click "Download Bundle" ("Secure Connect Bundle" section)
    After that put that archive in the folder of this project and name it "secure-connect-cassandra-schema-parser.zip", it will let .gitignore not to let your credentials out.

### 3. <code>npm run seed</code> to fill your db with schema and some data.

### 4. <code>npm start</code>

### 5. Enjoy :)
