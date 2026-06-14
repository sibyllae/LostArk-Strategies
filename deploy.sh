set -e

npm run build

cd dist

cp index.html 404.html

git init
git add -A
git commit -m 'update pages'
git push -f git@github.com:sibyllae/LostArk-Strategies.git HEAD:gh-pages
cd -