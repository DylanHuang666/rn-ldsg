:: ʹ��˵��������˵��

:: bundle_ios.bat ��Ŀ��

:: %1	��Ŀ��	��������ֻ�� TTT

:: call bundle_ios.bat TTT

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::

::cd %cd%
cd /d %~dp0
cd ..
cd ..
cd %1

:: ɾ��֮ǰ�������ļ�
rd /S /Q ios\assets
mkdir ios\assets

del ios\index.jsbundle
del ios\index.jsbundle.meta

:: ��� index.jsbundle
call node_modules\.bin\react-native ram-bundle --entry-file ./index.js --bundle-output ./ios/index.jsbundle --platform ios --assets-dest ./ios/ --dev false

:: �ж��Ƿ����ɳɹ�
@echo off
if not exist ios\index.jsbundle (goto :FAIL) else (goto :SUC)
:FAIL
echo ����iOS��index.jsbundleʧ��ʧ�ܣ�����
set THIS_BAT_RET=0
goto :EOF

:SUC
echo ����iOS��index.jsbundle�ɹ�!
set THIS_BAT_RET=1