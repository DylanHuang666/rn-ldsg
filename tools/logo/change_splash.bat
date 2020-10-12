

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::

:: 使用说明，参数说明

:: change_splash.bat 项目名

:: %1	项目名	例如现在只有 TTT

:: call change_splash.bat TTT

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::


set now_path=%~dp0

set IMAGE_MAGICK_BIN=%~dp0..\ImageMagick\win


:: 切换到项目文件夹内
cd /d %~dp0
cd ..
cd ..
cd %1

set SRC_LOGO3="logo\logo3.png"
set DST_ANDROID_RES="android\app\src\main\res"


:: android
%IMAGE_MAGICK_BIN%\convert -size 750x1624 xc:white -compose over %SRC_LOGO3% -geometry 180x248+285+369 -composite %DST_ANDROID_RES%\drawable-xhdpi\bg_loader.png

:: iOS
%IMAGE_MAGICK_BIN%\convert -size 750x1624 xc:white -compose over %SRC_LOGO3% -geometry 180x248+285+369 -composite ios\TTT\bg_loader.png
%IMAGE_MAGICK_BIN%\convert -size 750x1334 xc:white -compose over %SRC_LOGO3% -geometry 180x248+285+269 -composite ios\TTT\Images.xcassets\LaunchImage.launchimage\750x1334.png
%IMAGE_MAGICK_BIN%\convert -size 828x1792 xc:white -compose over %SRC_LOGO3% -geometry 180x248+324+369 -composite ios\TTT\Images.xcassets\LaunchImage.launchimage\828x1792.png
%IMAGE_MAGICK_BIN%\convert -size 1125x2436 xc:white -compose over %SRC_LOGO3% -geometry 180x248+472+400 -composite ios\TTT\Images.xcassets\LaunchImage.launchimage\1125x2436.png
%IMAGE_MAGICK_BIN%\convert -size 1242x2208 xc:white -compose over %SRC_LOGO3% -geometry 180x248+531+500 -composite ios\TTT\Images.xcassets\LaunchImage.launchimage\1242x2208.png
%IMAGE_MAGICK_BIN%\convert -size 1242x2688 xc:white -compose over %SRC_LOGO3% -geometry 180x248+531+530 -composite ios\TTT\Images.xcassets\LaunchImage.launchimage\1242x2688.png
