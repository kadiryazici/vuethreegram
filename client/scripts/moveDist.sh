set -euo pipefail


rm -rf clientfiles/
mkdir clientfiles/

cp -a dist/client/. clientfiles/public
mv clientfiles/public/ssr-manifest.json clientfiles/
cp dist/server/main.js clientfiles/

rm -rf ../server/clientfiles
mv clientfiles ../server/clientfiles

mv ../server/clientfiles/main.js ../server/clientfiles/main.cjs