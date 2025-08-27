# Deploy Guide with Docker Compose and HTTPS

This guide walks you through setting up multiple u5CMS sites behind an Nginx reverse proxy with automatic HTTPS certificates from Let's Encrypt.

## Prerequisites

- Docker and Docker Compose installed
- Domain names pointing to your server's public IP address (required for Let's Encrypt validation)

## Initial Setup

### 1. Initialize u5CMS Git Submodule

```bash
# Pull the u5cms submodule
git submodule update --init --recursive
```

### 2. Verify Domain Configuration

Ensure your domains resolve to your server:

```bash
nslookup eiam.deepsel.com
nslookup eiam2.deepsel.com
nslookup u5conference.nativeprotect.ch
nslookup standart-u5cms.nativeprotect.ch
```

Both should return your server's public IP address.

### 3. Certificate Generation Process

### Step 1: Configure Nginx for HTTP (Certificate Generation)

**Edit docker-compose.yml** - Update the nginx volume mount to use the temporary HTTP configuration:

```yaml
volumes:
  # Comment out the HTTPS config
  # - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
  # Use temporary HTTP config for certificate generation
  - ./nginx/http.temp.conf:/etc/nginx/conf.d/default.conf:ro
```

### Step 2: Start Services for Certificate Generation

```bash
# Start nginx and apache services (without certbot auto-renewal)
docker compose up -d eiam-nginx eiam-site eiam2-site eiam-db eiam2-db
```

### Step 3: Test Challenge Path

```bash
# Create test challenge directory
mkdir -p certbot/www/.well-known/acme-challenge

# Test that all domains can serve challenge files
echo "test challenge" > certbot/www/.well-known/acme-challenge/test
curl http://eiam.deepsel.com/.well-known/acme-challenge/test
curl http://eiam2.deepsel.com/.well-known/acme-challenge/test
curl http://u5conference.nativeprotect.ch/.well-known/acme-challenge/test
curl http://standart-u5cms.nativeprotect.ch/.well-known/acme-challenge/test
rm certbot/www/.well-known/acme-challenge/test
```

All curls should return "test challenge".

### Step 4: Generate SSL Certificates

**Important**: Use `--entrypoint=""` to override the renewal entrypoint for certificate generation:

```bash
# Generate certificates for eiam domains
docker compose run --rm --entrypoint="" eiam-certbot certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot/ \
    --email tim.tran@deepsel.com \
    --agree-tos \
    --no-eff-email \
    --verbose \
    -d eiam.deepsel.com \
    -d eiam2.deepsel.com

# Generate certificates for nativeprotect domains
docker compose run --rm --entrypoint="" eiam-certbot certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot/ \
    --email tim.tran@deepsel.com \
    --agree-tos \
    --no-eff-email \
    --verbose \
    -d u5conference.nativeprotect.ch

docker compose run --rm --entrypoint="" eiam-certbot certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot/ \
    --email tim.tran@deepsel.com \
    --agree-tos \
    --no-eff-email \
    --verbose \
    -d standart-u5cms.nativeprotect.ch
```

You should see:
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/eiam.deepsel.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/eiam.deepsel.com/privkey.pem
```

### Step 5: Switch to HTTPS Configuration

**Edit docker-compose.yml** - Update the nginx volume mount to use the HTTPS configuration:

```yaml
volumes:
  # Switch to HTTPS configuration
  - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
  # Comment out temporary HTTP config
  # - ./nginx/http.temp.conf:/etc/nginx/conf.d/default.conf:ro
```

### Step 6: Apply HTTPS Configuration

```bash
# Restart nginx with HTTPS configuration
docker compose restart eiam-nginx

# Start the certbot auto-renewal service
docker compose up -d eiam-certbot
```

## Verification

### Test HTTPS Setup

```bash
# Test HTTPS access (should work)
curl -I https://eiam.deepsel.com
curl -I https://eiam2.deepsel.com
curl -I https://u5conference.nativeprotect.ch
curl -I https://standart-u5cms.nativeprotect.ch

# Test HTTP redirect (should return 301 redirect)
curl -I http://eiam.deepsel.com
curl -I http://eiam2.deepsel.com
curl -I http://u5conference.nativeprotect.ch
curl -I http://standart-u5cms.nativeprotect.ch

# Check SSL certificate validity
openssl s_client -connect eiam.deepsel.com:443 -servername eiam.deepsel.com < /dev/null 2>/dev/null | openssl x509 -noout -dates
openssl s_client -connect u5conference.nativeprotect.ch:443 -servername u5conference.nativeprotect.ch < /dev/null 2>/dev/null | openssl x509 -noout -dates
openssl s_client -connect standart-u5cms.nativeprotect.ch:443 -servername standart-u5cms.nativeprotect.ch < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

### Verify Auto-Renewal

```bash
# Test renewal process (dry run)
docker compose exec eiam-certbot certbot renew --dry-run

# Check certbot logs
docker compose logs eiam-certbot
```

## Maintenance Commands

### Manual Certificate Renewal
```bash
# Force renewal (if needed)
docker compose run --rm --entrypoint="" eiam-certbot certbot renew --force-renewal

# Check certificate status
docker compose run --rm --entrypoint="" eiam-certbot certbot certificates
```

## Security Notes

- Certificates auto-renew every 12 hours
- HTTP traffic automatically redirects to HTTPS