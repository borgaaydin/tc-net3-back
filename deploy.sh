ssh $1@$2:$3 "git pull && git checkout -qf $TRAVIS_COMMIT"
ssh $1@$2:$3 "yarn install && (echo $(date) > config/BUILD) && pm2 restart app"
echo "Deployed $TRAVIS_COMMIT to production"
