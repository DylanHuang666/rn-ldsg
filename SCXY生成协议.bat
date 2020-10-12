

set now_path=%~dp0

cd /d %now_path%

cd protobuf

:: if exist AppProtocol (
::     cd AppProtocol
::     git pull --prune -v
::     cd ..
:: ) else (
::     git clone http://134.175.5.86:3000/protocol/AppProtocol.git
:: )
:: git submodule update --init --recursive
git submodule update --progress --init --recursive --force --remote -- "AppProtocol"



node gen_proto.js
