:: ʹ��˵��������˵��

:: bundle_android.bat ��Ŀ��

:: %1	��Ŀ��	��������ֻ�� TTT

:: call bundle_android.bat TTT

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::

::��������
set now_path=%~dp0
set project_name=%1

:: �л�����Ŀ�ļ�����
cd /d %now_path%\..\..\%project_name%

:: ɾ��֮ǰ�������ļ�
mkdir android\app\src\main\assets
del android\app\src\main\assets\index.jsbundle
del android\app\src\main\assets\index.jsbundle.meta
node %now_path%\clear_drawerbales.js %project_name%

:: ��� index.jsbundle
call node_modules\.bin\react-native ram-bundle --entry-file ./index.js --bundle-output ./android/app/src/main/assets/index.jsbundle --platform android --assets-dest ./android/app/src/main/res --dev false --indexed-ram-bundle

:: �ж��Ƿ����ɳɹ�
@echo off
if not exist android\app\src\main\assets\index.jsbundle (goto :FAIL) else (goto :SUC)
:FAIL
echo ����android��index.jsbundleʧ��ʧ�ܣ�����
set THIS_BAT_RET=0
goto :EOF

:SUC
echo ����android��index.jsbundle�ɹ�!
set THIS_BAT_RET=1
