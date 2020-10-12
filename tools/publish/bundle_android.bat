:: 使用说明，参数说明

:: bundle_android.bat 项目名

:: %1	项目名	例如现在只有 TTT

:: call bundle_android.bat TTT

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::

::参数变量
set now_path=%~dp0
set project_name=%1

:: 切换到项目文件夹内
cd /d %now_path%\..\..\%project_name%

:: 删除之前发布的文件
mkdir android\app\src\main\assets
del android\app\src\main\assets\index.jsbundle
del android\app\src\main\assets\index.jsbundle.meta
node %now_path%\clear_drawerbales.js %project_name%

:: 打包 index.jsbundle
call node_modules\.bin\react-native ram-bundle --entry-file ./index.js --bundle-output ./android/app/src/main/assets/index.jsbundle --platform android --assets-dest ./android/app/src/main/res --dev false --indexed-ram-bundle

:: 判定是否生成成功
@echo off
if not exist android\app\src\main\assets\index.jsbundle (goto :FAIL) else (goto :SUC)
:FAIL
echo 生成android的index.jsbundle失败失败！！！
set THIS_BAT_RET=0
goto :EOF

:SUC
echo 生成android的index.jsbundle成功!
set THIS_BAT_RET=1
