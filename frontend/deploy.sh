FRONTEND_DIR=${PWD}/frontend
cd ${FRONTEND_DIR}

git checkout production
git pull origin production

npm install
npm run build
rm -rf /var/www/html/*
cp -r ${FRONTEND_DIR}/build/* /var/www/html
