# PORT is for the Node.js app.
# UPSTREAM_PORT is for the Apache/Nginx PORT (see start-php.sh).
UPSTREAM_PORT=$(( $PORT + 1 )) node node-app/server.js
