:: 使用说明，参数说明

:: bundle_ios.bat 项目名

:: %1	项目名	例如现在只有 TTT

:: call bundle_ios.bat TTT

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::

::cd %cd%
cd /d %~dp0
cd ..
cd ..
cd %1

:: 删除之前发布的文件
rd /S /Q ios\assets
mkdir ios\assets

del ios\index.jsbundle
del ios\index.jsbundle.meta

:: 打包 index.jsbundle
call node_modules\.bin\react-native ram-bundle --entry-file ./index.js --bundle-output ./ios/index.jsbundle --platform ios --assets-dest ./ios/ --dev false

:: 判定是否生成成功
@echo off
if not exist ios\index.jsbundle (goto :FAIL) else (goto :SUC)
:FAIL
echo 生成iOS的index.jsbundle失败失败！！！
set THIS_BAT_RET=0
goto :EOF

:SUC
echo 生成iOS的index.jsbundle成功!
set THIS_BAT_RET=1