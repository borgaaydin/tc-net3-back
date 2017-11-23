echo "Dumping current database..."
docker exec $2 mongodump -d $3 > $3.json
if [ $? -eq 0 ]; then
    echo "OK"
fi

echo "Copying dump on host..."
docker cp $2:$3.json $1.json
if [ $? -eq 0 ]; then
    echo "OK"
fi

echo "Updating commit ID in last.build..."
echo $1 > last.build
if [ $? -eq 0 ]; then
    echo "OK"
fi

echo "Pulling repository..."
git pull
if [ $? -eq 0 ]; then
    echo "OK"
fi

echo "Checking out travis build commit..."
git checkout -qf $1
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
(echo $(date) > config/BUILD)
if [ $? -eq 0 ]; then
    echo "OK"
fi

echo "Restarting node server..."
pm2 restart app
if [ $? -eq 0 ]; then
    echo "OK"
fi
