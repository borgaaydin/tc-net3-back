export SSHPASS=$DEPLOY_PASS
sshpass -e ssh $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH "git pull && git checkout -qf $TRAVIS_COMMIT"
sshpass -e ssh $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH "yarn install && (echo $(date) > config/BUILD) && pm2 restart app"
