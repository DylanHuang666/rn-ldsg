#! /bin/sh
#cd `dirname $0`
now_path=$(cd $(dirname $0);pwd)


cd ${now_path}

cd protobuf

# if [ -d "AppProtocol" ];then
#     cd node_modules
#     git pull --prune -v
#     cd ..
# else
#     git clone http://134.175.5.86:3000/protocol/AppProtocol.git
# fi
# git submodule update --init --recursive
git submodule update --progress --init --recursive --force --remote -- "AppProtocol"

node gen_proto.js