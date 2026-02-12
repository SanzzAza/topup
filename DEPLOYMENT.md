# Deployment Guide - Sora 2

This guide covers deployment options for the Sora 2 AI Video Generation website.

## 📋 Table of Contents

1. [Local Development](#local-development)
2. [Heroku Deployment](#heroku-deployment)
3. [Docker Deployment](#docker-deployment)
4. [AWS Deployment](#aws-deployment)
5. [DigitalOcean Deployment](#digitalocean-deployment)

---

## 🖥️ Local Development

### Quick Start
```bash
./start.sh
```

### Manual Start
```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python3 app.py

# Access at http://localhost:5000
```

### Testing
```bash
# In another terminal, run tests
python3 test_api.py
```

---

## 🚀 Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Create a Procfile**
```bash
echo "web: python app.py" > Procfile
```

2. **Create runtime.txt**
```bash
echo "python-3.11.0" > runtime.txt
```

3. **Initialize Git (if not already done)**
```bash
git init
git add .
git commit -m "Initial commit"
```

4. **Create and Deploy to Heroku**
```bash
heroku create your-sora2-app
heroku config:set DEBUG=False
git push heroku main
heroku open
```

5. **View logs**
```bash
heroku logs --tail
```

---

## 🐳 Docker Deployment

### Create Dockerfile

Create a file named `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DEBUG=False
      - PORT=5000
    restart: unless-stopped
```

### Build and Run

```bash
# Build the image
docker build -t sora2 .

# Run the container
docker run -p 5000:5000 sora2

# Or use docker-compose
docker-compose up -d
```

---

## ☁️ AWS Deployment

### Option 1: AWS Elastic Beanstalk

1. **Install AWS EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB**
```bash
eb init -p python-3.11 sora2-app
```

3. **Create environment**
```bash
eb create sora2-env
```

4. **Deploy**
```bash
eb deploy
```

5. **Open application**
```bash
eb open
```

### Option 2: AWS EC2

1. **Launch an EC2 instance** (Ubuntu 22.04 LTS)

2. **Connect and setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and pip
sudo apt install python3 python3-pip -y

# Install nginx
sudo apt install nginx -y

# Clone or upload your code
git clone <your-repo>
cd sora2

# Install dependencies
pip3 install -r requirements.txt

# Install gunicorn
pip3 install gunicorn
```

3. **Create systemd service**

Create `/etc/systemd/system/sora2.service`:

```ini
[Unit]
Description=Sora 2 Video Generation
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/sora2
Environment="PATH=/home/ubuntu/.local/bin"
ExecStart=/home/ubuntu/.local/bin/gunicorn --workers 4 --bind 0.0.0.0:5000 app:app

[Install]
WantedBy=multi-user.target
```

4. **Configure Nginx**

Create `/etc/nginx/sites-available/sora2`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /home/ubuntu/sora2;
    }
}
```

5. **Enable and start**
```bash
sudo ln -s /etc/nginx/sites-available/sora2 /etc/nginx/sites-enabled/
sudo systemctl enable sora2
sudo systemctl start sora2
sudo systemctl restart nginx
```

---

## 🌊 DigitalOcean Deployment

### Using App Platform

1. **Push to GitHub**
```bash
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Create App in DigitalOcean**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository
   - Select the repository
   - Configure:
     - Build Command: `pip install -r requirements.txt`
     - Run Command: `python app.py`
     - Environment Variables: `PORT=8080`

3. **Deploy** - Click "Deploy"

### Using Droplet

1. **Create a Droplet** (Ubuntu 22.04)

2. **SSH into droplet**
```bash
ssh root@your-droplet-ip
```

3. **Setup application** (same as AWS EC2 steps above)

---

## 🔧 Production Considerations

### Environment Variables

Create a `.env` file:

```bash
DEBUG=False
PORT=5000
SECRET_KEY=your-secret-key-here
DATABASE_URL=your-database-url
API_KEY=your-video-api-key
```

### Use a Production Server

Replace Flask's development server with Gunicorn:

```bash
pip install gunicorn
gunicorn --workers 4 --bind 0.0.0.0:5000 app:app
```

### Add Database

For persistent storage, add a database:

```bash
# PostgreSQL example
pip install psycopg2-binary
```

Update `app.py` to use database for storing video metadata.

### Add Caching

```bash
pip install Flask-Caching
```

### Enable HTTPS

Use Let's Encrypt with Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Monitoring

Add monitoring and logging:

```bash
# Install monitoring tools
pip install newrelic
pip install sentry-sdk
```

### Security

1. **Add rate limiting**
```bash
pip install Flask-Limiter
```

2. **Add authentication**
```bash
pip install Flask-Login
```

3. **Secure headers**
```bash
pip install Flask-Talisman
```

---

## 📊 Performance Optimization

### CDN for Static Files

Use Cloudflare or AWS CloudFront for static files.

### Load Balancing

For high traffic, use:
- AWS Elastic Load Balancer
- Nginx load balancing
- HAProxy

### Caching Strategy

1. **Browser caching** - Set appropriate Cache-Control headers
2. **Server-side caching** - Use Redis or Memcached
3. **CDN caching** - Cache static assets

---

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Permission Denied
```bash
# Make scripts executable
chmod +x start.sh
chmod +x test_api.py
```

### Module Not Found
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### CORS Issues
Check `app.py` has `CORS(app)` enabled.

---

## 📞 Support

For deployment issues, check:
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Deployment Options](https://flask.palletsprojects.com/en/latest/deploying/)

---

**Happy Deploying! 🚀**
