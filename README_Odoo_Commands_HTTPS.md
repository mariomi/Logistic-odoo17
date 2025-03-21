
# README - Odoo Setup and SSL Configuration Commands

This file provides a list of essential commands and configurations used to set up and manage an Odoo instance
with SSL encryption, Nginx configuration, and domain handling for the domain `support-estilos.it`.

---

## Prerequisites

Make sure you have the following installed on your server:
- **Certbot** (for SSL certification with Let's Encrypt)
- **Nginx** (as a reverse proxy server for Odoo)

## Section 1: DNS Configuration
1. Ensure that the domain `support-estilos.it` points to your server's IP address (e.g., `35.228.230.5`).
2. Configure this in your DNS management panel (e.g., on Keliweb or Aruba) by creating an **A record** for `support-estilos.it`.

---

## Section 2: Install Certbot and Nginx Plugin
To install Certbot and its Nginx plugin, use:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

---

## Section 3: SSL Certificate Setup with Certbot
Once DNS is configured, follow these steps to obtain the SSL certificate for `support-estilos.it`.

1. **Request SSL Certificate**:
   ```bash
   sudo certbot --nginx -d support-estilos.it -d www.support-estilos.it
   ```

2. **Alternative command** (if you only need the main domain without `www`):
   ```bash
   sudo certbot --nginx -d support-estilos.it
   ```

3. **Check Renewal**:
   Certbot schedules renewals automatically, but you can manually test renewal with:
   ```bash
   sudo certbot renew --dry-run
   ```

---

## Section 4: Configure Nginx for Odoo and SSL

1. **Edit Nginx Site Configuration**:

   Use the following as an example for `/etc/nginx/sites-available/support-estilos.it`:
   ```nginx
   # Redirect all HTTP traffic to HTTPS
   server {
       listen 80;
       server_name support-estilos.it www.support-estilos.it;
       return 301 https://$host$request_uri;
   }

   # Main HTTPS Server Block
   server {
       listen 443 ssl;
       server_name support-estilos.it www.support-estilos.it;

       ssl_certificate /etc/letsencrypt/live/support-estilos.it/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/support-estilos.it/privkey.pem;

       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;

       location / {
           proxy_pass http://127.0.0.1:8069;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location ~* /web/static/ {
           proxy_cache_valid 200 90m;
           proxy_buffering on;
           expires 864000;
           proxy_pass http://127.0.0.1:8069;
       }

       # Let’s Encrypt challenge location
       location ~ /.well-known/acme-challenge/ {
           root /var/www/html;
           allow all;
       }
   }
   ```

2. **Activate Configuration and Reload Nginx**:

   Link the configuration file in `sites-enabled` and reload Nginx.
   ```bash
   sudo ln -s /etc/nginx/sites-available/support-estilos.it /etc/nginx/sites-enabled/
   sudo nginx -t  # Test configuration
   sudo systemctl reload nginx
   ```

---

## Section 5: Troubleshooting Common Errors

1. **Certbot Error - Could Not Install Certificate**:
   If Certbot fails to install the certificate, ensure the server block matches `server_name` in Nginx.

2. **Conflicting Server Name Warning**:
   This warning appears if there are multiple configurations with the same `server_name`. Remove duplicates or consolidate configurations.

3. **View Odoo Service Logs**:
   Check recent Odoo service logs for any issues:
   ```bash
   sudo journalctl -u odoo --since "5 minutes ago"
   ```

4. **Odoo Database and Role Errors**:
   - **Database Role Creation** (if needed):
     ```bash
     sudo -u postgres psql -c "CREATE ROLE odoo WITH LOGIN CREATEDB PASSWORD 'your_password';"
     ```

---

## Section 6: Useful Commands for System Management

- **Start/Stop/Restart Odoo**:
  ```bash
  sudo systemctl start odoo
  sudo systemctl stop odoo
  sudo systemctl restart odoo
  ```

- **Check Nginx Syntax**:
  ```bash
  sudo nginx -t
  ```

---

This guide provides a comprehensive reference for setting up Odoo with SSL on `support-estilos.it`. Follow each section for detailed instructions and troubleshooting tips.
