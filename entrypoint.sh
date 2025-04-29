#!/bin/bash

# Fix permissions at runtime
echo "Setting permissions on 'r' and 'fileversions'..."
chmod -R 777 /var/www/html/r /var/www/html/fileversions

# Start Apache
echo "Starting Apache..."
exec apache2-foreground
