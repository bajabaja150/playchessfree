# playchessfree
Online multiplayer chess game
Site is live at https://www.playchessfree.com

Backend: LAMP stack
Frontend: HTML, CSS, JavaScript

How to install on a server:

1. Install and configure LAMP stack, install phpmyadmin
2. Set up virtual host in appache configuration
3. Copy files into /var/www/playchessfree, import chess_db.sql database scheme from database directory in phpmyadmin
4. install composer
5. go into /var/www/playchessfree/ratchet and install dependencies, namely ratchet websocket library
6. Note: application uses secure websockets (wss:/) and will require walid SSL certificate installed and configured for virtual host, also check permissions for certificates, it is likely that a higher privilege will need to be granted
7. run server with php bin/server.php from inside ratchet directory
8. application should be functional now, but it is recommended to run server as a systemd service
9. Edit DNS records so that A record points to server's public IPv4 address
10. Edit DNS records so that CNAME record points to www.yourdomainname
11. 
