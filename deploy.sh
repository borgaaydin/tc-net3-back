git pull
git checkout -qf $1
yarn install
yarn upgrade
(echo $(date) > config/BUILD)
pm2 restart app"
