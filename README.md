# 📚 Book Searcher

## 🧩 Project Structure

```
book_searcher/
│
├── client/      # React frontend (MUI)
│   ├── src/
│   └── package.json
│
├── server/      # Node.js + Express backend
│   ├── libs/elasticsearch.js
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## 🐳 Step 1: Install Docker (if not already installed)

### 🪟 **For Windows**
1. Download and install **Docker Desktop** from:  
   👉 [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. After installation, open PowerShell or Command Prompt and verify:
   ```bash
   docker --version
   ```

### 🍎 **For macOS**
1. Download from the same link above or use **Homebrew**:
   ```bash
   brew install --cask docker
   ```
2. Start Docker from Applications and verify installation:
   ```bash
   docker --version
   ```

---

## 🧠 Step 2: Run Elasticsearch Server in Docker

We’ll use **Elasticsearch 7.5.2** version for compatibility.

### 🧩 Create a Docker network (optional but recommended)
```bash
docker network create somenetwork
```

### 🐳 Pull Elasticsearch Image
```bash
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.5.2
```

### 🚀 Run Elasticsearch Container

#### 🪟 **For Windows (PowerShell / CMD)**
```bash
docker run -d ^
  --name elasticsearch ^
  --net somenetwork ^
  -p 9200:9200 -p 9300:9300 ^
  -e "discovery.type=single-node" ^
  docker.elastic.co/elasticsearch/elasticsearch:7.5.2
```

#### 🍎 **For macOS / Linux (Terminal)**
```bash
docker run -d   --name elasticsearch   --net somenetwork   -p 9200:9200 -p 9300:9300   -e "discovery.type=single-node"   docker.elastic.co/elasticsearch/elasticsearch:7.5.2
```

> ⚠️ **Note:** The container exposes ports `9200` (HTTP) and `9300` (internal cluster communication).  
> Ensure no other services are running on those ports.

### ✅ Verify Elasticsearch is running
```bash
curl -X GET http://localhost:9200
```
You should see a JSON response with cluster name and version info.

---

## 💻 Step 3: Run the Application

### Open the project folder
```bash
cd book_searcher
```

---

### 🧭 Step 3.1: Start the Frontend (React Client)

Open a new terminal:
```bash
cd book_searcher
cd client
npm install
npm start
```

Runs the React app at:  
👉 [http://localhost:3000](http://localhost:3000)

---

### ⚙️ Step 3.2: Start the Backend (Node.js Server)

Open another terminal window:
```bash
cd book_searcher
cd server
npm install
npm start
```

Backend API runs at:  
👉 [http://localhost:5000](http://localhost:5000)

---

## 🧾 Environment Variables (Optional)

Create a `.env` file inside `server/` if you want to customize configuration:

```
ELASTICSEARCH_NODE=http://localhost:9200
PORT=5000
```

---

## 🧹 Common Docker Commands

| Command | Description |
|----------|-------------|
| `docker ps` | Show running containers |
| `docker stop elasticsearch` | Stop the Elasticsearch container |
| `docker start elasticsearch` | Restart Elasticsearch |
| `docker rm -f elasticsearch` | Remove the container completely |
| `docker network ls` | List all Docker networks |

---

## 🧑‍💻 Tech Stack

**Frontend:** React, Material UI  
**Backend:** Node.js, Express.js  
**Search Engine:** Elasticsearch (running in Docker)  
**Language:** JavaScript (ES6)

---

## 💡 Author

**Ankush Tanwar**  
Full Stack Developer | MERN / Node.js | Elasticsearch | React  
📍 NCR, India

---

## 🏁 Quick Recap of Commands

```bash
# 1️⃣ Create network (optional)
docker network create somenetwork

# 2️⃣ Pull Elasticsearch image
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.5.2

# 3️⃣ Run Elasticsearch container
docker run -d --name elasticsearch --net somenetwork -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.5.2

# 4️⃣ Start frontend
cd book_searcher/client
npm install
npm start

# 5️⃣ Start backend
cd book_searcher/server
npm install
npm start
```

---

## 🎯 Result

Once all services are running:
- Frontend → http://localhost:3000  
- Backend → http://localhost:4000  
- Elasticsearch → http://localhost:9200  

