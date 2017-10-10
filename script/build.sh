__DIRNAME="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$(cd "$__DIRNAME/../build" && pwd)"
ROOT_DIR="$(cd "$__DIRNAME/.." && pwd)"
TMP="$BUILD_DIR/tmp.js"
MODULE_VERSION="$(node $__DIRNAME/module-version.js)"

node "$__DIRNAME/banner.js" > $TMP
cat "$ROOT_DIR/index.js" \
	| sed 's/@MODULE_VERSION@/'"$MODULE_VERSION"'/g' \
	>> $TMP

uglifyjs \
	--comments '/^!/' \
	--beautify \
	-- "$BUILD_DIR/tmp.js" \
	> "$BUILD_DIR/cyclical-json.js"

uglifyjs \
	--compress \
	--mangle \
	--comments '/^!/' \
	-- "$BUILD_DIR/tmp.js" \
	> "$BUILD_DIR/cyclical-json.min.js"

rm $TMP
