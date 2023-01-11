.PHONY: dist

dist:
	npx @vercel/ncc build index.js -o dist
