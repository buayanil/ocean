# Getting started

## Environment Setup

### Firewall

Configure iptables configuration

```
iptables -F

iptables -P INPUT ACCEPT
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT


iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 22 -j ACCEPT

# HTTPS
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT

# HTTP
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 80 -j ACCEPT

# HTTP
iptables -A INPUT -p tcp --dport 9000 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 9000 -j ACCEPT

# External PostgreSQL
iptables -A OUTPUT -p tcp --dport 5432 -j ACCEPT

# External LDAP
iptables -A OUTPUT -p tcp --dport 636 -j ACCEPT

# loopback device
iptables -A INPUT -i lo -s 127.0.0.0/8 -d 127.0.0.0/8 -j ACCEPT
iptables -A OUTPUT -o lo -d 127.0.0.0/8 -s 127.0.0.0/8 -j ACCEPT

# internal subnet
iptables -A INPUT ! -s 141.45.0.0/16 -j DROP
iptables -A OUTPUT ! -d 141.45.0.0/16 -j DROP

# Ping
iptables -A INPUT -p icmp -j ACCEPT
iptables -A OUTPUT -p icmp -j ACCEPT

# DNS
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT

# NTP 
iptables -A OUTPUT -p udp --dport 123 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 123 -j ACCEPT

iptables -A INPUT -j DROP
iptables -A OUTPUT -j DROP

echo -n "#"      > /etc/network/if-up.d/iptables
echo -n !       >> /etc/network/if-up.d/iptables
echo /bin/sh    >> /etc/network/if-up.d/iptables
echo "iptables-restore < /etc/firewall.conf" >> /etc/network/if-up.d/iptables

chmod +x /etc/network/if-up.d/iptables
```

### Frontend Requirements

Install NodeJS [14.X]

```
# curl -sL https://deb.nodesource.com/setup_14.x | bash -
# apt-get -y install nodejs gcc g++ make
```

Install npm

```
# apt-get instal nodejs npm build-essential
# wget https://www.npmjs.com/install.sh
# chmod +x install.sh
# ./install.sh
```

Clone repository

```bash
$ git clone https://github.com/HTWHub/ocean.git
```

### Backend Requirements

Install JDK package

```
# apt-get install default-jdk -y
```

Download the necessary scala .deb file

```
wget www.scala-lang.org/files/archive/scala-2.13.5.deb
```

Install the Scala .deb file

```
sudo dpkg -i scala*.deb
```

Add necessary repository for sbt

```
echo "deb https://dl.bintray.com/sbt/debian /" | tee -a /etc/apt/sources.list.d/sbt.list
```

Add public key for installation

```
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2EE0EA64E40A89B84B2DF73499E82A75642AC823
apt-get update
```

Finally install sbt

```
apt-get install sbt -y
```

Once the installation is complete, test to make sure all is working

```
sbt test
```

### Apache

Install apache2 webserver

```
# apt install apache2
```

Check apache2 service status

```
# systemctl status apache2
```

Allow React-Router-DOM to handle routes

```
# a2enmod rewrite
# systemctl restart apache2
```

Add lines to enable RewriteEngine in `etc/apache2/sites-enabled/000-default.conf`

```
<Directory "/var/www/html">
    RewriteEngine on
    # Don't rewrite files or directories
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]
    # Rewrite everything else to index.html to allow html5 state links
    RewriteRule ^ index.html [L]
</Directory>
```

Get permission for user

```
usermod -aG www-data local
chown -R www-data:www-data /var/www/html
chmod -R 770 /var/www/html
```

### Create a systemd service

Create a systemd service file `nano /etc/systemd/system/backend.service`
```
[Unit]
Description=Backend (Play Framework) service.
After=network.target

[Service]
Type=simple
User=local
WorkingDirectory=/home/local/db1/backend
Environment="APPLICATION_SECRET=""
Environment="JWT_SECRET="
Environment="SLICK_DB_URL="
Environment="SLICK_DB_USER="
Environment="SLICK_DB_PASSWORD="
Environment="HOST_IP="
Environment="PG_CLUSTER_HOSTNAME="
Environment="PG_CLUSTER_PORT="
Environment="PG_CLUSTER_DATABASE="
Environment="PG_CLUSTER_USER="
Environment="PG_CLUSTER_PASSWORD="

ExecStart=/bin/bash /home/local/ocean/backend/target/universal/backend-1.0/bin/backend

[Install]
WantedBy=multi-user.target
```

Reload all service configurations with `systemctl daemon-reload` and allow the user local to manage the service ` nano /etc/sudoers.d/local`.

```
%local ALL= NOPASSWD: /bin/systemctl start backend
%local ALL= NOPASSWD: /bin/systemctl stop backend
%local ALL= NOPASSWD: /bin/systemctl restart backend
```

Obtain the systemd service status with
```
systemctl status backend
journalctl -u backend
```

### PostgreSQL Cluster

Create the file repository configuration:

```sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'```

Import the repository signing key:

```wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -```

Update the package lists:

```apt-get update```

Install the latest version of PostgreSQL.

```apt-get -y install postgresql-12```

Start the database server using:

```pg_ctlcluster 12 main start```

After installing the PostgreSQL database server by default, it creates a user postgres with role postgres. It also creates a system account with the same name postgres. So to connect to postgres server, login to your system as user postgres and connect the database.

```psql -c "alter user postgres with password 'STRONG_PASSWORD'"```

 Change the Listen Address in `/etc/postgresql/12/main/postgresql.conf`

```listen_addresses = '*'```

Also increase the maximum connections. Each PostgreSQL connection consumes RAM for managing the connection or the client using it. The more connections you have, the more RAM you will be using that could instead be used to run the database.

```max_connections = 400```

Integrate LDAP authentication in file ``

```
host    all             all             all                     ldap ldapscheme="ldaps" ldapserver="login-dc-01.login.htw-berlin.de" ldapprefix="cn=" ldapsuffix=", ou=idmusers,dc=login,dc=htw-berlin,dc=de" ldapport=636
```

Provide a initial database

```create database internal with owner=postgres connection limit = -1;```

## Development

### Docker Images

This project provides a docker image with PostgreSQL, MySQL, MongoDB and Adminer in the directory `backend/docker`.

### Play framework

Runs the app in the development mode.

```sbt run -Dconfig.resource=application.dev.conf```

Runs the tests
```sbt test```

Builds the app for production
```sbt dist```