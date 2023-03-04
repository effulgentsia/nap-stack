# $PORT is for the Node.js app; give Apache or Nginx a different PORT.
PORT=$(( $PORT + 1 )) procmgr-binary /layers/paketo-buildpacks_php-start/php-start/procs.yml
