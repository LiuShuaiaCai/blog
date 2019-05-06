---
title: JWT 小结
date: 2019-04-15 12:30:34
categories: 用户认证
tags: ['JWT']
---
![JWT小结](/images/jwt-php2.jpg)
通过 [官方文档](https://jwt.io/introduction) 对 JWT 做了初步的 [了解](/2019/04/11/jwt/)，又参考了一些好的文章总结了一下。
<!--more-->
## 1、JWT 组成
JWT 由三部分组成：header + payload + signature，这三部分用 base64 编码后，最终 Token 由点（.）将编码后的字符串连接起来。具体流程如下：
![JWT-PHP](/images/jwt-php.jpg)
备注：如果图片看不清楚，可以看[源文件](http://note.youdao.com/noteshare?id=a14eab7c8b5aea1d0c79419d8e96138b)，下面再大致的说一下三个部分内容：
### 1.1、Header 头信息
Header 通常由两部分组成：**签名类型**（即“JWT”） 和 **签名算法**（例如 HMAC SHA256 或 RSA ）。
例如：

```php
{
    "alg": "HS256",
    "typ": "JWT"
}
```
Header 部分的信息一般是必须的，有开发人员自己提前定义的。签名算法（alg）是必不可少的，因为后面获取签名要使用该算法，常用算法：HS256,HS384,HS512,RS256,RS384,RS512,ES256,ES384,ES512,PS256,PS384,PS512。

### 1.2、Payload 载荷
Payload 包含的是需要验证的信息，下面是一般常规的[验证属性](https://tools.ietf.org/html/rfc7519#section-4.1)：

属性 | 全拼 | 说明
:--- | :--- | :---
iss | Issuer | 该 JWT 的签发者
iat | Issued At | 签发时间
exp | Expiration Time | 过期时间,这里是一个 Unix 时间戳
nbf | Not Before | 该时间之前不接收处理该 Token
sub | Subject | 该 JWT 所面向的用户
aud | Audience | 接收该 JWT 的一方
jti | JWT ID | 该 Token 的唯一标识

在 [JWT 简介](/2019/04/11/jwt/) 中已经介绍过，Payload 有三种类型声明 registered、public 和 private，例如：
```php
array(
    'iss' => 'lsc',
    'iat' => time(),
    'exp' => time() + 20,
    'nbf' => time(),
    'sub' => 'admin.com',
    'aud' => 'www.admin.com',
    'jti' => md5(uniqid('JWT').time()),
    'uid' => 123,
    'userName' => 'sweet'
);
```
这些属性都是可选的，不是必须的，自己也可以自定义一些属性。
当然我们也可以把一些常用的非私密的信息放在 Payload 中，来减少一些数据库的查询。

### 1.3、Signature 签名
签名是对 Header 和 Payload 通过签名算法（Header['alg']）加密后编码的字符串，主要用于验证，防止用户修改 Token 信息。

    key = 'secretkey'
    unsignedToken = encodeBase64(header) + '.' + encodeBase64(payload)
    signature = HMAC-SHA256(key, unsignedToken)

最后生成 Token

    token = encodeBase64(header) + '.' + encodeBase64(payload) + '.' + encodeBase64(signature)

## 2、JWT 的工作方式
用户在登录成功之后的每次请求都会带上 JWT，通常 JWT 放在 Header 头信息中的 Authorization 字段中，表示方法如下：

    Authorization: Bearer <token>

JWT 应用的基本使用流程：

    1、账户密码登录成功后；
    2、根据验证信息获取 Token，返还给客户端，由客户端保存在 localstorage 或者 cookie 中；
    3、之后的每次请求，在头信息中 `Authorization:Bearer <token>` ,到达服务端；
    4、服务端接收到请求之后，通过签名以及时间的验证，判断所传 Token 是否有效；
    5、有效：返回服务端数据，无效：重新登录
    备注：我们还需要将服务器设置为接受来自所有域的请求，用Access-Control-Allow-Origin: *˜
## 3、PHP 实现 JWT
下面是我参考 [PHP 使用 jwt 用户身份认证 ](https://learnku.com/articles/21951) ,整理了一下代码如下：
```php
<?php
interface JwtInterface
{
    /**
     * 获取 Token
     * @param array $header 头信息
     * @param array $payload JWT载荷
     * 
     * @return string
     */
    public function getToken():string;

    /**
     * 验证 Token 是否有效，默认验证 exp nbf iat时间
     * @param string $token 需要验证的 Token 值
     * 
     * @return bool
     */
    public function verifyToken(string $token):array;
}


class Jwt implements JwtInterface
{
    /**
     * 默认的头部信息
     * @property string alg 生成 signature 的算法
     * @property string typ 类型
     */
    private $header = array(
        'alg' => 'HS256',
        'typ' => 'JWT'
    );

    /**
     * alg 对应的算法方式
     * 
     * @property array $algConfig
     */
    private $algConfig = array(
        'HS256' => 'sha256',
    );

    /**
     * JWT 的有效载荷
     * 
     * @property array $payload
     */
    private $payload;

    /**
     * 使用 HMAC 生成信息摘要时所使用的密钥
     * 
     * @property string $key;
     */
    private $key = '123456';

    /**
     * 初始化 JWT 的有效载荷
     */
    public function __construct()
    {
        /**
         * 默认的有效载荷，非必须
         * 
         * @property string iss (Issuer) 该 JWT 的签发者
         * @property int iat (Issued At) 签发时间
         * @property int exp (Expiration Time) 过期时间
         * @property int nbf (Not Before) 该时间之前不接收处理该 Token
         * @property string sub (Subject) 该 JWT 所面向的用户
         * @property string aud (Audience) 接收该 JWT 的一方
         * @property string jti (JWT ID) 该 Token 的唯一标识
         */
        $this->payload = array(
            'iss' => 'lsc',
            'iat' => time(),
            'exp' => time() + 20,
            'nbf' => time(),
            'sub' => 'admin.com',
            'aud' => 'www.admin.com',
            'jti' => md5(uniqid('JWT').time())
        );
    }

    /**
     * 设置头信息 Header
     * 
     * @param array $header 
     * 
     * @return $this
     */
    public function setHeader(array $header):Jwt
    {
        $this->header = array_merge($this->header, $header);
        return $this;
    }

    /**
     * 设置 JWT 的有效载荷
     * 
     * @param array $payload
     * 
     * @return $this
     */
    public function setPayload(array $payload):Jwt
    {
        $this->payload = array_merge($this->payload, $payload);
        return $this;
    }

    /**
     * 设置密钥
     * 
     * @param string $key
     * 
     * @return $this
     */
    public function setKey(string $key):Jwt
    {
        if($key){
            $this->key = $key;
        }
        return $this;
    }

    /**
     * https://jwt.io/ 中base64UrlEncode编码实现
     * 
     * @param string $input 需要编码的字符串
     * 
     * @return string
     */
    private function base64UrlEncode(string $input):string
    {
        return str_replace('=', '', strtr(base64_encode($input), '+/', '-_'));
    }

    /**
     * https://jwt.io/ 中base64UrlEncode解码实现
     * 
     * @param string $input 需要解码的字符串
     * 
     * @return string
     */
    private function base64UrlDecode(string $input):string
    {
        $remainder = strlen($input) % 4;
        if ($remainder) {
            $addlen = 4 - $remainder;
            $input .= str_repeat('=', $addlen);
        }
        return base64_decode(strtr($input, '-_', '+/'));
    }

    /**
     * https://jwt.io/ 中HMACSHA256签名实现
     * 
     * @param string $input 为base64UrlEncode(header).".".base64UrlEncode(payload)
     * 
     * @return string
     */
    private function signature(string $input, string $alg):string
    {
        return $this->base64UrlEncode(
            hash_hmac(
                $this->algConfig[$alg],
                $input,
                $this->key,
                true
            )
        );
    }

    /**
     * 获取jwt token
     * 
     * @return string
     */
    public function getToken():string
    {
        if ($this->payload && $this->header) {
            $base64Header = $this->base64UrlEncode(json_encode($this->header, JSON_UNESCAPED_UNICODE));
            $base64Payload = $this->base64UrlEncode(json_encode($this->payload, JSON_UNESCAPED_UNICODE));
            $token = $base64Header .'.'. $base64Payload.'.'.$this->signature($base64Header .'.'. $base64Payload, $this->header['alg']);
        } else {
            $token = '';
        }

        return $token;
    }

    /**
     * 验证 token 是否有效，默认只验证 exp, nbf, iat 时间
     * 
     * @param string $token 需要验证的 token
     * 
     * @return array
     */
    public function verifyToken(string $token):array
    {
        $tokens = explode('.', $token);
        if (count($tokens) != 3) {
            echo 'Token 格式不正确'; 
            return [];
        }

        // 列出 Header、Payload、Signature
        list($base64Header, $base64Payload, $sign) = $tokens;

        // 获取 JWT 算法
        $base64DecodeHeader = json_decode($this->base64UrlDecode($base64Header), JSON_OBJECT_AS_ARRAY);
        if (!isset($base64DecodeHeader['alg']) || !$base64DecodeHeader['alg']) {
            echo 'JWT 算法不能为空';
            return [];
        }

        // 验证签名
        if ($this->signature($base64Header.'.'.$base64Payload, $base64DecodeHeader['alg']) !== $sign) {
            echo '签名认证失败';
            return [];
        }
            
        $payload = json_decode($this->base64UrlDecode($base64Payload), JSON_OBJECT_AS_ARRAY);

        // 签发时间大于当前服务器时间验证失败
        if (isset($payload['iat']) && $payload['iat'] > time()) {
            echo '签发时间大于当前服务器时间';
            return [];
        }

        // 过期时间小于当前服务器时间验证失败
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            echo '过期时间小于当前服务器时间';
            return [];
        }

        // 该 nbf 时间之前不接收处理该 Token
        if (isset($payload['nbf']) && $payload['nbf'] > time()) {
            echo '该 nbf 时间之前不接收处理该 Token';
            return [];
        }

        // 返回 JWT 的有效载荷
        return $payload;
    }
}

$jwt = new Jwt();

$token = $jwt->getToken();
// echo $token;


$payload = $jwt->verifyToken($token);
print_r($payload);
```

打印结果如下：

    Array
    (
        [iss] => lsc
        [iat] => 1555435646
        [exp] => 1555435666
        [nbf] => 1555435646
        [sub] => admin.com
        [aud] => www.admin.com
        [jti] => 28bc53b6c411a7362951fdaf50fa075f
    )

这个小 Demo 包含了获取 Token，以及验证 Token 是否正确，功能较为简洁，但很容易理解，更能帮助理解这个过程。


## 4、注意事项
由于 Token 中的信息是公开的，所以在使用的过程中，最好注意以下几点：
+ 不要将私密信息放在 Token 中；
+ 最好结合 SSL 使用（我也没试过）
+ 如果 Token 存在 Cookie 中，服务器要同时验证cookie或header中是否有token
    + Token 的大小是否超过 Cookie 的限制
    + 请使用HttpOnly标志。若有可能，使用Secure标志。（没使用过）
    + 采用同步令牌（Synchronize Token）来防止CSRF【这是因为，在A站点上发起向B站点的请求时，B站点的Cookie同样会被发送给B。若不使用另一个Token来防护，则无法得知cookie中的JWT是否属于从A->B，还是从B->B。目前，大部分现有的框架已经支持】
    + 为了[重放攻击(replay attack)](https://baike.baidu.com/item/%E9%87%8D%E6%94%BE%E6%94%BB%E5%87%BB/2229240?fr=aladdin)，可以加上jti、exp和iat声明来验证 Token

## 5、JWT 优缺点
由于HTTP协议是无状态的，所以，我们已经认证的用户，在下一次请求的时候，服务器并不知道他是谁，我们必须再次认证。

### 5.1、传统的认证方式
传统的做法是将已经认证过的用户信息存储在服务器上，比如Session。用户下次请求的时候带着Session ID，然后服务器以此检查用户是否认证过。

这种传统的认证方式存在一些问题：

+ Sessions : 每次用户认证通过以后，服务器需要创建一条记录保存用户信息，通常是在内存中，随着认证通过的用户越来越多，服务器的在这里的开销就会越来越大。

+ CORS : 当我们想要扩展我们的应用，让我们的数据被多个移动设备使用时，我们必须考虑跨资源共享问题。当使用AJAX调用从另一个域名下获取资源时，我们可能会遇到禁止请求的问题。

### 5.2、JWT 与 Session 的差异
Session是在服务器端的，而JWT是在客户端的。

Session方式存储用户信息的最大问题在于要占用大量服务器内存，增加服务器的开销。

而JWT方式将用户状态分散到了客户端中，可以明显减轻服务端的内存压力。

### 5.3、使用 Token 的优缺点
优点：

- 无状态和可扩展性：Tokens存储在客户端。完全无状态，可扩展。我们的负载均衡器可以将用户传递到任意服务器，因为在任何地方都没有状态或会话信息。

- 安全：Token不是Cookie。（The token, not a cookie.）每次请求的时候Token都会被发送。而且，由于没有Cookie被发送，还有助于防止CSRF攻击。即使在你的实现中将token存储到客户端的Cookie中，这个Cookie也只是一种存储机制，而非身份认证机制。没有基于会话的信息可以操作，因为我们没有会话!

- token在一段时间以后会过期，这个时候用户需要重新登录。这有助于我们保持安全。还有一个概念叫token撤销，它允许我们根据相同的授权许可使特定的token甚至一组token无效。

- 减少服务器的内存压力

缺点：
+ 我自己感觉还是不够很安全，因为 Payload 中的信息都是可以看到的

+ Token 会随着 Payload 中的数据增多而增大，数据太大，可能会超过 Cookie 或者 localstorage 的限制

## 6、使用场景
从上面可以了解到，JWT 适合用于向 Web 应用传递一些非敏感信息。JWT 还经常用于设计用户认证和授权系统，以及实现 Web 应用的单点登录。

## 7、参考资料
由于自己还是菜鸟，所以之上部分有从别人博客复制过来的，以备之后复习，下面是参考的博客（谢谢大佬们的博客）：
+ [JWT必知必会](https://segmentfault.com/a/1190000008250581)
+ [认识JWT](https://www.cnblogs.com/cjsblog/p/9277677.html)
+ [JSON Web Token - 在Web应用间安全地传递信息](http://blog.leapoahead.com/2015/09/06/understanding-jwt/)