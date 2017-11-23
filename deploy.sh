echo "Checking if deploying is allowed..."
if [ -e nodeploy ]; then
    echo "FAIL"
    exit 1
else
    echo "OK"
fi

echo "Dumping current database..."
docker exec $2 mongodump --archive=$3.gz --gzip --db $3
if [ $? -eq 0 ]; then
    echo "OK"
else
    echo "FAIL"
    exit 1
fi

echo "Copying dump on host..."
docker cp $2:$3.gz $(git rev-parse HEAD).gz
if [ $? -eq 0 ]; then
    echo "OK"
else
    echo "FAIL"
    exit 1
fi

echo "Saving last build date in last.build.date..."
echo $(cat config/BUILD) > last.build.date
if [ $? -eq 0 ]; then
    echo "OK"
else
    echo "FAIL"
    exit 1
fi

echo "Saving last build commit ID in last.build..."
echo $(git rev-parse HEAD) > last.build
if [ $? -eq 0 ]; then
    echo "OK"
else
    echo "FAIL"
    exit 1
fi

echo "Pulling repository..."
git pull origin master
if [ $? -eq 0 ]; then
    echo "OK"
else
    echo "FAIL"
    exit 1
fi

echo "Checking out travis build commit..."
git checkout -qf $1
if [ $? -eq 0 ]; then
    echo "OK"
else
    echo "FAIL"
    exit 1
fi

echo "Running yarn install..."
yarn install
if [ $? -eq 0 ]; then
    echo "OK"
else
    echo "FAIL"
    exit 1
fi

echo "Running yarn upgrade..."
yarn upgrade
if [ $? -eq 0 ]; then
    echo "OK"
else
    echo "FAIL"
    exit 1
fi

echo "Updating build date..."
echo $(date) > config/BUILD
if [ $? -eq 0 ]; then
    echo "OK"
else
    echo "FAIL"
    exit 1
fi

echo "Restarting node server..."
pm2 restart app
if [ $? -eq 0 ]; then
    echo "OK"
else
    echo "FAIL"
    exit 1
fi
