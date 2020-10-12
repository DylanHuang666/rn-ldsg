cd /d %~dp0

::git配置
::autocrlf == true (Winodws方案)
    ::提交时，将CRLF 转成 LF再提交；
    ::检出时，自动将LF 转为 CRLF;
::autocrlf == input (Linux/Mac方案)
    ::提交时，将CRLF 转成 LF再提交；
    ::检出时，保持LF
::autocrlf == false
    ::可以理解为原文保存

git config --global core.autocrlf true
git config --global core.fileMode false
git config --global credential.helper store
git config core.autocrlf true
git config core.fileMode false

::安装完node后建议设置npm镜像以加速后面的过程（或使用科学上网工具）。
call npm config set registry https://registry.npm.taobao.org --global
call npm config set registry https://registry.npm.taobao.org

call npm config set disturl https://npm.taobao.org/dist --global
call npm config set disturl https://npm.taobao.org/dist

call npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/ --global
call npm config set phantomjs_cdnurl http://npm.taobao.org/mirrors/phantomjs --global
call npm config set electron_mirror http://npm.taobao.org/mirrors/electron/ --global
call npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
call npm config set phantomjs_cdnurl http://npm.taobao.org/mirrors/phantomjs
call npm config set electron_mirror http://npm.taobao.org/mirrors/electron/


:: 安装yarn
call npm install -g yarn

::安装完yarn后同理也要设置镜像源
call yarn config set registry https://registry.npm.taobao.org --global
call yarn config set registry https://registry.npm.taobao.org


call yarn config set disturl https://npm.taobao.org/dist --global
call yarn config set disturl https://npm.taobao.org/dist

call yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/ --global
call yarn config set phantomjs_cdnurl http://npm.taobao.org/mirrors/phantomjs --global
call yarn config set electron_mirror http://npm.taobao.org/mirrors/electron/ --global
call yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
call yarn config set phantomjs_cdnurl http://npm.taobao.org/mirrors/phantomjs
call yarn config set electron_mirror http://npm.taobao.org/mirrors/electron/

:: 使用nrm工具切换淘宝源
call npx nrm use taobao
:: 如果之后需要切换回官方源可使用 
:: call npx nrm use npm