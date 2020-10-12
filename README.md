# Windows 软件环境 #

* vscode

    在官网下载就可以了<br>
    https://code.visualstudio.com/

* svn

    点击下载:[TortoiseSvn](http://192.168.101.211/K%BF%AA%B7%A2%B9%A4%BE%DF/svn/TortoiseSVN-1.11.1.28492-x64-svn-1.11.1.msi)

* git(注意安装顺序)

    * 点击下载(<font color='red'>安装路径只能有英文、数字，不能有空格、中文</font>)：[Git](http://192.168.101.211/K%BF%AA%B7%A2%B9%A4%BE%DF/git/Git-2.21.0-64-bit.exe)

    * (可选)点击下载：[TortoiseGit](http://192.168.101.211/K%BF%AA%B7%A2%B9%A4%BE%DF/git/TortoiseGit-2.7.0.0-64bit.msi)

    * (可选)点击下载：[SourceTree](http://192.168.101.211/K%BF%AA%B7%A2%B9%A4%BE%DF/git/SourceTreeSetup-3.0.17.exe)

* nodejs

    点击下载(<font color='red'>安装路径只能有英文、数字，不能有空格、中文</font>)：[node10.15.3](http://192.168.101.211/K%BF%AA%B7%A2%B9%A4%BE%DF/nodejs/node-v10.15.3-x64.msi)

* python

    点击下载(<font color='red'>安装路径只能有英文、数字，不能有空格、中文</font>)：[python2.7.16](http://192.168.101.211/K%BF%AA%B7%A2%B9%A4%BE%DF/python/python-2.7.16.amd64.msi)

* 环境初始化

    双击运行 ENV_INIT.bat


# Mac 软件环境 #

* vscode

    在官网下载就可以了<br>
    https://code.visualstudio.com/

* xcode
    > 在appstore安装

* commandlinetools
    > 打开命令行 <br>
    > xcode-select --install

* cocoapods
    > 打开命令行 <br>
    > sudo gem install cocoapods<br>
    > mkdir -p ~/.cocoapods/repos
    > cd ~/.cocoapods/repos<br>
    > pod repo remove master<br>
    > git clone https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git master

* Homebrew
    > 打开命令行 <br>
    > cd ${工作目录} <br>
    > sh tools/brew_install.sh

    <font color='red'>当出现以下这句，就可以直接 ctrl + c 继续执行</font> <br>
    > ==> Tapping homebrew/core<br>
    > Cloning into '/usr/local/Homebrew/Library/Taps/homebrew/homebrew-core'...

* watchman
    > 打开命令行 <br>
    > brew install watchman

* nodejs

    点击下载：[node10.15.3](http://192.168.101.211/K%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/nodejs/node-v10.15.3.pkg)

* python

    点击下载：[python2.7.16](http://192.168.101.211/K%BF%AA%B7%A2%B9%A4%BE%DF/python/python-2.7.16-macosx10.6.pkg)

* 环境初始化
    > 打开命令行 (执行过程中需要输入登陆密码) <br>
    > sh ./ENV_INIT.sh<br>


# 调试 #

* 安装apk/ipa

    android: 在 YL客户端群 文件下载

    iOS: 在 YL客户端群的公告打开蒲公英链接安装

* 运行RN的js调试服务器
    > 打开命令行 vscode自带的<br>
    > start_reat.bat<br>

* app设置rn服务器(没有重新安装、请缓存，就只设置一次)
    * 启动app后摇一摇弹出菜单
    * 点击 Dev Settings
    * 点击 Debug server host & port for device
    * 填上 自己的ip:8081，例如: 192.168.101.24:8081
    * 第一次填写完，需要重启app

* 每次修改完js代码，可以摇一摇，点击reload加载代码

# 在package.json添加库 #

* 只能使用windows添加
* 在package.json添加库后
* 执行 根目录/G更新_???_node_modules.bat
* 执行后，会出现很多修改，但是很多都是 换行修改而已，可以不理会，提交的时候git会自动报warn忽略的

* 在项目中引用添加的原生库
    * 看看这个库的安装说明
    * 一般可以使用命令
        > node_modules\\.bin\react-native link 库名称

# 修node_modules里面的库的bug #

* 修改完，必须要在 根目录/GX更新_node_modules.bat 添加这些库的还原操作

# 第三方服务器依赖 #
![第三方依赖](./第三方依赖.jpg)