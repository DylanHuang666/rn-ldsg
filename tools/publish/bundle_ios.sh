#! /bin/sh

##########################################################

# 使用说明，参数说明

# bundle_ios.sh 项目名

# $1	项目名	例如现在只有 TTT

# sh bundle_ios.sh TTT

##########################################################

# 切换到项目文件夹内
#cd `dirname $0`
cd $(cd $(dirname $0);pwd)
cd ../../$1

# 删除之前发布的文件
rm -rf ios/assets
mkdir ios/assets

rm ios/index.jsbundle
rm ios/index.jsbundle.meta

# 打包 index.jsbundle
sh node_modules/.bin/react-native ram-bundle --entry-file ./index.js --bundle-output ./ios/index.jsbundle --platform ios --assets-dest ./ios/ --dev false
