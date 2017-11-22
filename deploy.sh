ssh $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH "git pull && git checkout -qf $TRAVIS_COMMIT"
ssh $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH "yarn install && (echo $(date) > config/BUILD) && pm2 restart app"
echo "Deployed $TRAVIS_COMMIT to production"
