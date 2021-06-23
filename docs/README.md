## Project Info

The platform provides simple access to different managed databases without any setup.

# Backend

## Environment Setup

### Create a systemd service

Create a systemd service file `nano /usr/lib/systemd/system/backend.service`.
```
[Unit]
Description=Backend (Play Framework) service.
After=network.target

[Service]
Type=simple
User=local
WorkingDirectory=/home/local/db1/backend
Environment="APPLICATION_SECRET="
Environment="JWT_SECRET="
Environment="SLICK_DB_URL="
Environment="SLICK_DB_USER="
Environment="SLICK_DB_PASSWORD="
Environment="HOST_IP="
ExecStart=/bin/bash /home/local/db1/backend/target/universal/backend-1.0/bin/backend

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
systemctl status backend.service
journalctl -u backend.service
```

