#!/bin/bash

cd $(cd $(dirname $0);pwd)

ruby brew_install



mkdir -p /usr/local/Homebrew/Library/Taps/homebrew
cd /usr/local/Homebrew/Library/Taps/homebrew

# git -C "$(brew --repo homebrew/core)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git
# git -C "$(brew --repo homebrew/cask)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask.git
# git -C "$(brew --repo homebrew/cask-fonts)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask-fonts.git
# git -C "$(brew --repo homebrew/cask-drivers)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask-drivers.git


git clone https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git
git clone https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask.git
git clone https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask-fonts.git
git clone https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask-drivers.git