#! /bin/sh

#cd `dirname $0`
cd $(cd $(dirname $0);pwd)

#git配置
#autocrlf == true (Winodws方案)
    #提交时，将CRLF 转成 LF再提交；
    #检出时，自动将LF 转为 CRLF;
#autocrlf == input (Linux/Mac方案)
    #提交时，将CRLF 转成 LF再提交；
    #检出时，保持LF
#autocrlf == false
    #可以理解为原文保存

git config --global core.autocrlf input
git config --global core.fileMode false
git config --global credential.helper store
git config core.autocrlf input
git config core.fileMode false

#安装完node后建议设置npm镜像以加速后面的过程（或使用科学上网工具）。
npm config set registry https://registry.npm.taobao.org --global
npm config set registry https://registry.npm.taobao.org

npm config set disturl https://npm.taobao.org/dist --global
npm config set disturl https://npm.taobao.org/dist

npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/ --global
npm config set phantomjs_cdnurl http://npm.taobao.org/mirrors/phantomjs --global
npm config set electron_mirror http://npm.taobao.org/mirrors/electron/ --global
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
npm config set phantomjs_cdnurl http://npm.taobao.org/mirrors/phantomjs
npm config set electron_mirror http://npm.taobao.org/mirrors/electron/


sudo npm install -g yarn

#安装完yarn后同理也要设置镜像源
yarn config set registry https://registry.npm.taobao.org --global
yarn config set registry https://registry.npm.taobao.org

yarn config set disturl https://npm.taobao.org/dist --global
yarn config set disturl https://npm.taobao.org/dist

yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/ --global
yarn config set phantomjs_cdnurl http://npm.taobao.org/mirrors/phantomjs --global
yarn config set electron_mirror http://npm.taobao.org/mirrors/electron/ --global
yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
yarn config set phantomjs_cdnurl http://npm.taobao.org/mirrors/phantomjs
yarn config set electron_mirror http://npm.taobao.org/mirrors/electron/

# 使用nrm工具切换淘宝源
npx nrm use taobao
# 如果之后需要切换回官方源可使用 
# npx nrm use npm



# 修改项目 node_modules 脚本为可执行
sudo node tools/chmod_node_modules.js $(cd $(dirname $0);pwd)/node_modules