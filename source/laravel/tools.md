---
title: Laravel 常用库
date: 2019-06-27 13:33:33
tags: ['Laravel','tool']
---
## [1、reliese/laravel](https://github.com/codemaxbr/reliese)
`reliese/laravel` 可以很方便的创建数据表模型，包括各种属性，前提是：数据库必须已经可以连接。
Github地址：[https://github.com/codemaxbr/reliese](https://github.com/codemaxbr/reliese)

## [2、larave-ide-helper](https://packagist.org/packages/barryvdh/laravel-ide-helper)
Laravel IDE Helper 是一个极其好用的代码提示及补全工具，可以给编写代码带来极大的便利。
库地址：[https://packagist.org/packages/barryvdh/laravel-ide-helper](https://packagist.org/packages/barryvdh/laravel-ide-helper)
### 安装 `larave-ide-helper`

    composer require barryvdh/laravel-ide-helper --dev

### 安装 `doctrine/dbal`
在为模型注释字段的时候必须用到它，所以尽量安装上它

    composer require doctrine/dbal --dev

### 添加配置
在 「config/app.php」文件的 「providers」数组中添加下面的配置：

    Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class

因为该包主要在开发环境中使用，所以最好的方法是只在开发环境中调用，所以可以在「app/Providers/AppServiceProvider.php」文件中的「register」方法中添加下面代码：
```php
if ($this->app->environment() !== 'production') {
    $this->app->register(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class)
}
```

### 导出配置文件
一般默认配置就可以满足需求，如果满足需求，也可以忽略这一步。

    php artisan vendor:publish --provider="Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider" --tag=config

到这里，包已经安装完成了，下面可以愉快的使用了。。。
### 按照以下顺序编译生成提示：

    + php artisan clear-compiled - 删除文件 「bootstrap/compiled.php」清楚缓存
    + php artisan ide-helper:generate - 为 Facades 生成注释
    + php artisan ide-helper:models - 为数据模型生成注释
    + php artisan ide-helper:meta - 生成 PhpStorm Meta file

### 自动运行 generate
想在依赖包更新是自动更新注释，可以在 composer.json 文件中做如下配置：

    "scripts":{
        "post-update-cmd": [
            "Illuminate\\Foundation\\ComposerScripts::postUpdate",
            "php artisan ide-helper:generate",
            "php artisan ide-helper:meta",
            "php artisan optimize"
        ]
    },

提示：如果只在 dev 环境下部署 ide helper 还是不要这么做了，防止在生产环境中报错导致不必要的麻烦。