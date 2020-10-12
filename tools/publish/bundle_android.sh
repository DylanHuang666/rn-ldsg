#! /bin/sh

##########################################################

# 使用说明，参数说明

# bundle_android.sh 项目名

# $1	项目名	例如现在只有 TTT

# sh bundle_android.sh TTT

##########################################################

# 参数变量
now_path=$(cd $(dirname $0);pwd)
project_name=$1

# 切换到项目文件夹内
#cd `dirname $0`
cd ${now_path}/../../${project_name}

# 删除之前发布的文件
mkdir android/app/src/main/assets
rm android/app/src/main/assets/index.jsbundle
rm android/app/src/main/assets/index.jsbundle.meta
# node ${now_path}/clear_drawerbales.js ${project_name}

# 打包 index.jsbundle
sh node_modules/.bin/react-native ram-bundle --entry-file ./index.js --bundle-output ./android/app/src/main/assets/index.jsbundle --platform android --assets-dest ./android/app/src/main/assets --dev false --indexed-ram-bundle