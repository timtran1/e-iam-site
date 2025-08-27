# Use PHP 7.4 with Apache
FROM php:7.4-apache

# Install required PHP extensions and git
RUN apt-get update && apt-get install -y \
    libmariadb-dev \
    git \
    && docker-php-ext-install mysqli

# Enable Apache mod_rewrite (for .htaccess support)
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy your local u5CMS files into the container
# COPY ./u5CMS /var/www/html/

# clone u5cms repository
RUN git clone https://github.com/u5cms/u5cms.git /var/www/html --depth 1

# Copy the entrypoint script
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Adjust file permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 777 /var/www/html/fileversions /var/www/html/r

# Expose Apache port
EXPOSE 80

# Use the entrypoint
ENTRYPOINT ["/entrypoint.sh"]
