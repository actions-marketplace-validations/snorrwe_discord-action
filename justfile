dist:
	npx @vercel/ncc build index.js -o dist

init:
    npm i

changelog tag:
    git cliff --tag {{tag}} > CHANGELOG.md
