#!/bin/bash

# Script to generate self-signed SSL certificates for local development
# Usage: ./generate-ssl-certs.sh [domain]

DOMAIN=${1:-salesbase.local}
SSL_DIR="./nginx/ssl"
DAYS=365

# Create SSL directory if it doesn't exist
mkdir -p $SSL_DIR

echo "Generating self-signed SSL certificate for $DOMAIN"

# Generate private key
openssl genrsa -out $SSL_DIR/privkey.pem 2048

# Generate CSR
openssl req -new -key $SSL_DIR/privkey.pem -out $SSL_DIR/cert.csr -subj "/CN=$DOMAIN/O=SalesBase/C=US"

# Create and sign the certificate
openssl x509 -req -days $DAYS -in $SSL_DIR/cert.csr -signkey $SSL_DIR/privkey.pem -out $SSL_DIR/cert.pem

# Create fullchain.pem (for Nginx)
cat $SSL_DIR/cert.pem > $SSL_DIR/fullchain.pem

# Clean up CSR file
rm $SSL_DIR/cert.csr

echo "Self-signed SSL certificate generated successfully"
echo "Certificate path: $SSL_DIR/fullchain.pem"
echo "Private key path: $SSL_DIR/privkey.pem"
echo ""
echo "NOTE: For local development, you will need to add the following entry to your hosts file:"
echo "127.0.0.1 $DOMAIN"
echo ""
echo "For production, please use proper SSL certificates from a trusted CA."
