cd /d %~dp0

::git����
::autocrlf == true (Winodws����)
    ::�ύʱ����CRLF ת�� LF���ύ��
    ::���ʱ���Զ���LF תΪ CRLF;
::autocrlf == input (Linux/Mac����)
    ::�ύʱ����CRLF ת�� LF���ύ��
    ::���ʱ������LF
::autocrlf == false
    ::�������Ϊԭ�ı���

git config --global core.autocrlf true
git config --global core.fileMode false
git config --global credential.helper store
git config core.autocrlf true
git config core.fileMode false

::��װ��node��������npm�����Լ��ٺ���Ĺ��̣���ʹ�ÿ�ѧ�������ߣ���
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


:: ��װyarn
call npm install -g yarn

::��װ��yarn��ͬ��ҲҪ���þ���Դ
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

:: ʹ��nrm�����л��Ա�Դ
call npx nrm use taobao
:: ���֮����Ҫ�л��عٷ�Դ��ʹ�� 
:: call npx nrm use npm