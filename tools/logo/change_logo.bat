

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::

:: 使用说明，参数说明

:: change_logo.bat 项目名

:: %1	项目名	例如现在只有 TTT

:: call change_logo.bat TTT

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::


set now_path=%~dp0

set IMAGE_MAGICK_BIN=%~dp0..\ImageMagick\win


:: 切换到项目文件夹内
cd /d %~dp0
cd ..
cd ..
cd %1

set SRC_LOGO1="logo\logo.png"
set SRC_LOGO2="logo\logo2.png"
set SRC_LOGO3="logo\logo3.png"
set DST_ANDROID_RES="android\app\src\main\res"
set DST_IOS_RES="ios\TTT\Images.xcassets\AppIcon.appiconset"
set DST_IMAGES="images"


%IMAGE_MAGICK_BIN%\convert -resize 72x72 %SRC_LOGO1% %DST_ANDROID_RES%\mipmap-hdpi\ic_launcher.png
%IMAGE_MAGICK_BIN%\convert -resize 72x72 %SRC_LOGO2% %DST_ANDROID_RES%\mipmap-hdpi\ic_launcher_round.png

%IMAGE_MAGICK_BIN%\convert -resize 48x48 %SRC_LOGO1% %DST_ANDROID_RES%\mipmap-mdpi\ic_launcher.png
%IMAGE_MAGICK_BIN%\convert -resize 48x48 %SRC_LOGO2% %DST_ANDROID_RES%\mipmap-mdpi\ic_launcher_round.png

%IMAGE_MAGICK_BIN%\convert -resize 96x96 %SRC_LOGO1% %DST_ANDROID_RES%\mipmap-xhdpi\ic_launcher.png
%IMAGE_MAGICK_BIN%\convert -resize 96x96 %SRC_LOGO2% %DST_ANDROID_RES%\mipmap-xhdpi\ic_launcher_round.png

%IMAGE_MAGICK_BIN%\convert -resize 144x144 %SRC_LOGO1% %DST_ANDROID_RES%\mipmap-xxhdpi\ic_launcher.png
%IMAGE_MAGICK_BIN%\convert -resize 144x144 %SRC_LOGO2% %DST_ANDROID_RES%\mipmap-xxhdpi\ic_launcher_round.png

%IMAGE_MAGICK_BIN%\convert -resize 192x192 %SRC_LOGO1% %DST_ANDROID_RES%\mipmap-xxxhdpi\ic_launcher.png
%IMAGE_MAGICK_BIN%\convert -resize 192x192 %SRC_LOGO2% %DST_ANDROID_RES%\mipmap-xxxhdpi\ic_launcher_round.png

::%IMAGE_MAGICK_BIN%\convert -size 750x1470 xc:white -compose over %SRC_LOGO3% -geometry 180x248+285+369 -composite %DST_ANDROID_RES%\drawable-xhdpi\bg_loader.png


%IMAGE_MAGICK_BIN%\convert -resize 40x40 %SRC_LOGO1% %DST_IOS_RES%\40x40.png
%IMAGE_MAGICK_BIN%\convert -resize 58x58 %SRC_LOGO1% %DST_IOS_RES%\58x58.png
%IMAGE_MAGICK_BIN%\convert -resize 60x60 %SRC_LOGO1% %DST_IOS_RES%\60x60.png
%IMAGE_MAGICK_BIN%\convert -resize 80x80 %SRC_LOGO1% %DST_IOS_RES%\80x80.png
%IMAGE_MAGICK_BIN%\convert -resize 87x87 %SRC_LOGO1% %DST_IOS_RES%\87x87.png
%IMAGE_MAGICK_BIN%\convert -resize 120x120 %SRC_LOGO1% %DST_IOS_RES%\120x120.png
%IMAGE_MAGICK_BIN%\convert -resize 120x120 %SRC_LOGO1% %DST_IOS_RES%\120x120-1.png
%IMAGE_MAGICK_BIN%\convert -resize 180x180 %SRC_LOGO1% %DST_IOS_RES%\180x180.png
%IMAGE_MAGICK_BIN%\convert -resize 1024x1024 %SRC_LOGO1% %DST_IOS_RES%\1024x1024.png

::%IMAGE_MAGICK_BIN%\convert -size 750x1624 xc:white -compose over %SRC_LOGO3% -geometry 180x248+285+369 -composite ios\TTT\bg_loader.png


%IMAGE_MAGICK_BIN%\convert -resize 1024x1024 %SRC_LOGO1% %DST_IMAGES%\logo@3x.png
%IMAGE_MAGICK_BIN%\convert -resize 512x512 %SRC_LOGO2% %DST_IMAGES%\ic_logo_circle@3x.png
%IMAGE_MAGICK_BIN%\convert -resize 176x176 %SRC_LOGO2% %DST_IMAGES%\message\ic_offical_message@3x.png