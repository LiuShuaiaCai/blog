---
title: VundleVim 安装 NERDTree
date: 2019-04-02 18:09:25
categories: Vim
tags: ['Vim']
---
Vim 配置 NERDTree 效果展示如下:
![vim](/images/vim.jpg)
<!--more-->

## 1、[安装 VundleVim](https://github.com/muahao/Vundle.vim)
### 1.1、下载Vundle
```php
$ git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
```
### 1.2、插件配置
在 `~/.vimrc` 中添加配置
```php
set nocompatible              " be iMproved, required
filetype off                  " required

" set the runtime path to include Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
" alternatively, pass a path where Vundle should install plugins
"call vundle#begin('~/some/path/here')

" let Vundle manage Vundle, required
Plugin 'VundleVim/Vundle.vim'

" The following are examples of different formats supported.
" Keep Plugin commands between vundle#begin/end.
" plugin on GitHub repo
" Plugin 'tpope/vim-fugitive'
" plugin from http://vim-scripts.org/vim/scripts.html
" Plugin 'L9'
" Git plugin not hosted on GitHub
Plugin 'git://git.wincent.com/command-t.git'
Plugin 'https://github.com/scrooloose/nerdtree.git'
" git repos on your local machine (i.e. when working on your own plugin)
" Plugin 'file:///home/gmarik/path/to/plugin'
" The sparkup vim script is in a subdirectory of this repo called vim.
" Pass the path to set the runtimepath properly.
" Plugin 'rstacruz/sparkup', {'rtp': 'vim/'}
" Install L9 and avoid a Naming conflict if you've already installed a
" different version somewhere else.
" Plugin 'ascenator/L9', {'name': 'newL9'}

" All of your Plugins must be added before the following line
call vundle#end()            " required
filetype plugin indent on    " required
" To ignore plugin indent changes, instead use:
"filetype plugin on
"
" Brief help
" :PluginList       - lists configured plugins
" :PluginInstall    - installs plugins; append `!` to update or just :PluginUpdate
" :PluginSearch foo - searches for foo; append `!` to refresh local cache
" :PluginClean      - confirms removal of unused plugins; append `!` to auto-approve removal
"
" see :h vundle for more details or wiki for FAQ
" Put your non-Plugin stuff after this line
```
### 1.2、安装插件
打开 Vim 执行: 
```php
:PluginInstall
```

或者在命令行执行: 
```php
vim +PluginInstall +qall
```

安装之后在 `~/.vim/bundle` 文件夹下有以下文件
```php
├── Vundle.vim
├── command-t
├── nerdtree
└── nerdtree-git-plugin
```

## 2、[NERDTree 配置](https://github.com/scrooloose/nerdtree)
修改 `~/.vimrc` 文件
### 2.1、vim启动时自动打开NERDTree
```php
autocmd vimenter * NERDTree
```

### 2.2、映射特定键或快捷方式以打开NERDTree
配置快捷键 Ctrl+n（你可以设置你想要的任何键）
```php
map <C-n> :NERDTreeToggle<CR>
```

### 2.3、更多配置
[https://github.com/scrooloose/nerdtree](https://github.com/scrooloose/nerdtree)

## 3、NERDTree 快捷键
NERDTree 快捷键如下：

    ctrl + w + h    光标 focus 左侧树形目录
    ctrl + w + l    光标 focus 右侧文件显示窗口
    ctrl + w + w    光标自动在左右侧窗口切换
    ctrl + w + r    移动当前窗口的布局位置
    o       在已有窗口中打开文件、目录或书签，并跳到该窗口
    go      在已有窗口 中打开文件、目录或书签，但不跳到该窗口
    t       在新 Tab 中打开选中文件/书签，并跳到新 Tab
    T       在新 Tab 中打开选中文件/书签，但不跳到新 Tab
    i       split 一个新窗口打开选中文件，并跳到该窗口
    gi      split 一个新窗口打开选中文件，但不跳到该窗口
    s       vsplit 一个新窗口打开选中文件，并跳到该窗口
    gs      vsplit 一个新 窗口打开选中文件，但不跳到该窗口
    !       执行当前文件
    O       递归打开选中 结点下的所有目录
    x       合拢选中结点的父目录
    X       递归 合拢选中结点下的所有目录
    e       Edit the current dif
    双击    相当于 NERDTree-o
    中键    对文件相当于 NERDTree-i，对目录相当于 NERDTree-e
    D       删除当前书签
    P       跳到根结点
    p       跳到父结点
    K       跳到当前目录下同级的第一个结点
    J       跳到当前目录下同级的最后一个结点
    k       跳到当前目录下同级的前一个结点
    j       跳到当前目录下同级的后一个结点
    C       将选中目录或选中文件的父目录设为根结点
    u       将当前根结点的父目录设为根目录，并变成合拢原根结点
    U       将当前根结点的父目录设为根目录，但保持展开原根结点
    r       递归刷新选中目录
    R       递归刷新根结点
    m       显示文件系统菜单
    cd      将 CWD 设为选中目录
    I       切换是否显示隐藏文件
    f       切换是否使用文件过滤器
    F       切换是否显示文件
    B       切换是否显示书签
    q       关闭 NerdTree 窗口
    ?       切换是否显示 Quick Help

切换标签页

    :tabnew [++opt选项] ［＋cmd］ 文件      建立对指定文件新的tab
    :tabc   关闭当前的 tab
    :tabo   关闭所有其他的 tab
    :tabs   查看所有打开的 tab
    :tabp   前一个 tab
    :tabn   后一个 tab

标准模式下： 

    gT 前一个 tab 
    gt 后一个 tab 
    MacVim 还可以借助快捷键来完成 tab 的关闭、切换
    cmd+w 关闭当前的 tab
    cmd+{ 前一个 tab 
    cmd+} 后一个 tab 
    
NerdTree 在 .vimrc 中的常用配置
```php
" 在 vim 启动的时候默认开启 NERDTree（autocmd 可以缩写为 au） 
autocmd VimEnter * NERDTree 
" 按下 F2 调出/隐藏 NERDTree 
map :silent! NERDTreeToggle 
" 将 NERDTree 的窗口设置在 vim 窗口的右侧（默认为左侧） 
let NERDTreeWinPos="right" 
" 当打开 NERDTree 窗口时，自动显示 Bookmarks 
let NERDTreeShowBookmarks=1
```