#!/bin/bash

cd $(cd $(dirname $0);pwd)

sudo gem install cocoapods
mkdir -p ~/.cocoapods/repos
cd ~/.cocoapods/repos
pod repo remove master
git clone https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git master