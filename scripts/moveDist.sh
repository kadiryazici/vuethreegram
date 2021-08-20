set -euo pipefail

rm -rf prod/client
mkdir prod/client

mv client/dist/client/ssr-manifest.json client/dist/server
mv client/dist/client/assets client/dist/
rm -rf client/dist/client/
mv client/dist/* prod/client

# cp -a dist/client/. clientfiles/public
# cp dist/server/main.js clientfiles/

# rm -rf ../server/clientfiles
# mv clientfiles ../server/clientfiles

# mv ../server/clientfiles/main.js ../server/clientfiles/main.cjs