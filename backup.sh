echo "Forbidding new deploys..."
touch nodeploy
if [ $? -eq 0 ]; then
    echo "OK"
fi

echo "Copying database dump to mongo container..."
docker cp $(cat last.build).gz $1:backup.gz
if [ $? -eq 0 ]; then
    echo "OK"
fi

echo "Restauring dump..."
docker exec $1 mongorestore --drop --gzip --archive=backup.gz
if [ $? -eq 0 ]; then
    echo "OK"
fi

echo "Checking out last build..."
git checkout -qf $(cat last.build)
if [ $? -eq 0 ]; then
    echo "OK"
fi

echo "Running yarn install..."
yarn install
if [ $? -eq 0 ]; then
    echo "OK"
fi

echo "Running yarn upgrade..."
yarn upgrade
if [ $? -eq 0 ]; then
    echo "OK"
fi

echo "Updating build date..."
(echo $(cat last.build.date) > config/BUILD)
if [ $? -eq 0 ]; then
    echo "OK"
fi

echo "Restarting node server..."
pm2 restart app
if [ $? -eq 0 ]; then
    echo "OK"
fi
