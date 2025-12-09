# ✅ **Option 2 — Use mongosh inside the Mongo Docker container**

The official MongoDB image **no longer includes the mongo shell**, but we can install mongosh inside it:

```bash
docker exec -it কন্টেইনারের_নাম bash
```

Inside container:

```bash
apt-get update
apt-get install -y wget gnupg
wget -qO - https://pgp.mongodb.com/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-mongosh
```

Then run:

```bash
mongosh
show dbs
```

### Connect to MongoDB via Compass

In MongoDB Compass, you will connect to the container using the following settings:

- **Hostname**: `localhost` or `127.0.0.1`
- **Port**: `27017`
- **Authentication**: If you haven't set up authentication in the container, you can leave this blank. Otherwise, provide the credentials.

#### Example:

- **Connection String**: `mongodb://localhost:27017`

     - OR
     - **Hostname**: `localhost`
     - **Port**: `27017`

If your MongoDB has authentication enabled, you would also need to provide your username and password.

### Step 4: Verify the Connection

- Click on **Connect**.
- If everything is set up correctly, you should now be able to see the databases inside your MongoDB container in Compass.
