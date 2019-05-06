---
title: JWT 简介
date: 2019-04-11 15:33:56
categories: 用户认证
tags: ["JWT"]
---
![JWT](/images/jwt.jpg)
原文：[https://jwt.io/introduction](https://jwt.io/introduction/)
<!--more-->
## 1、什么是JWT

JSON Web Token (JWT) 是一个开放标准 （[RFC 7519](https://tools.ietf.org/html/rfc7519)），它定义了一种紧凑并且独立的方式，用于在各方之间作为 JSON 对象安全的传输信息。此信息可以通过数字签名进行验证和信任。JWT 可以使用加密（使用 [HMAC](https://tools.ietf.org/html/rfc2104) 算法）或者使用 RSA 或者 ECDSA 的公钥/私钥对进行签名。

虽然 JWT 可以通过加密在各方之间提供保密，但 JWT 将专注于「签名令牌」。「签名令牌」可以验证其中包含的声明的完整性，而「加密令牌」则隐藏在其他地方的声明。当使用公钥/私钥对签名令牌时，签名还证明只有持有私钥的一方是签署它的一方。

## 2、什么时候应该使用 JWT

以下是 JSON Web Token 的一些使用场景：

+ Authorization（授权）：这是使用 JWT 的最常见方案。一旦用户登录，之后的每个请求都将包括 JWT，允许用户访问该令牌允许访问的路由、服务和资源。Single Sign On(单点登录) 是一种现在防范使用 JWT 的功能，应为它的开销很小，并且能够在不同的域中轻松使用。

+ Information Exchange（信息交换）：JWT 是在各端之间安全传输信息的好方法。因为 JWT 可以签名 - 例如，使用公钥/私钥时，你可以确定发送人是否准确，此外，由于使用标头和有效负载计算签名，你还可以验证内容是否被篡改。

## 3、什么是 JWT 结构

在紧凑形式中，JSON Web Token 由三部分组成，各部分之间用圆点（.）连接，它们是：

+ Header（头信息）
+ Payload（有效荷载）
+ Signature（签名）

因此，JWT 格式通常如下：

```php
xxxxx.yyyyy.zzzzz
```

***接下来，具体看一下各个部分：***

### 3.1、Header
Header 通常由两部分组成：**签名类型**（即“JWT”） 和 **签名算法**（例如 HMAC SHA256 或 RSA ）。
例如：

```php
{
    "alg": "HS256",
    "typ": "JWT"
}
```

然后，这个 JSON 被编码为 Base64Url ，形成 JWT 的第一部分。

### 3.2、Payload

令牌的第二部分是 payload，其中包含声明。声明是关于实体（通常是指用户）和其他数据的声明，声明有三种类型：registered、public 和 private。

+ Registered claims: 这是一组预先定义的声明，这些声明不是强制，但是建议提供一组有用的、可相互操作的声明。其中包括：iss (issuer), exp (expiration time), sub(subject), aud (audience) 等。

+ Public claims: 可以随意定义。但是为避免冲突，应在 [IANA JSON Web Token 注册表](https://www.iana.org/assignments/jwt/jwt.xhtml) 中定义它们，或者将其定义为包含防冲突命名空间的URI。

+ Private claims: 用于在同意使用它们的各方之间共享信息，并且不是注册的或公开的声明。

例如：

```php
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

然后，payload 经过 Base64Url 编码，形成 JSON Web Token 的第二部分。

**⚠️注意：对于签名令牌，虽然可以防止信息被篡改，但是任何人都可以读取。除非加密，否则不要将私密信息放在 JWT 的 payload 或者 header 中。**

### 3.3、Signature

要创建签名部分，你必须有编码过的 header、编码过的 payload、密钥，签名算法是 header 中指定的那个算法（HS256），然后对其进行签名。形成 JSON Web Token 的第三部分。
例如，如果要使用 HMAC SHA256 算法，将按以下方式创建签名：

```php
HMACSHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload), 
    secret
)
```

签名是用于验证消息在传递过程中是否被修改，并且，对于使用私钥签名的 token，还可以验证 JWT 的发件方是否是它所声称的发送方。

### 3.4、Putting all together

JWT 最后结果由三个部分用点（.）连接起来的 Base64-URL 字符串，可以在 HTML 和 HTTP 环境中轻松传递，而与基于 XML 的标准（如 SAML）相比更加紧凑。

下面显示了一个 JWT 的例子，它包括 header 和 payload，以及加密的签名。
![JWT2](/images/jwt2.png)

你可以使用 [jwt.io Debugger](http://jwt.io/) 来解码，验证和生成 JWT。
![JWT3](/images/jwt3.png)

## 4、JWT 如何工作
在身份验证中，当用户登录成功后，将返回 JSON Web Token。由于 Token 是凭证，因此必须非常小心以防止出现安全问题。一般情况下，不应该将 Token 保留的时间超过要求。

每当用户想要访问受保护的路由或资源时，用户代理应该使用**承载模式**发送 JWT，通常在 **Authorization** 标头中，标题的内容应该如下所示：

    Authorization: Bearer <token>

在某些情况下，这可以是无状态授权机制。服务器中受保护的路由将检查 <code style="color:#c7254e">Authorization</code> 标头中有效的 JWT，如果存在，则允许用户访问受保护的资源。如果 JWT 中包含必要的数据，则可以减少查询数据库以减少某些操作的需要，尽管可能并非如此。

如果在头信息 <code style="color:#c7254e">Authorization</code> 中发送 Token，则跨域资源共享（CORS）将不会成为问题，因为它不使用 cookie。

下图展示了如何获取 JWT 并使用访问 API 或资源：
![JWT4](/images/jwt4.png)
1、应用程序或客户端向授权服务器请求授权。这是通过其中一个不同的授权流程执行的。例如，典型的 [OpenID Connect](http://openid.net/connect/) 兼容Web应用程序将/oauth/authorize使用[授权代码](http://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)流通过端点；
2、给予授权后，授权服务器会向应用程序返回访问令牌；
3、应用程序使用访问令牌来访问受保护的资源（如API）。

**⚠️注意：使用签名令牌，令牌中包含的所有信息都会向用户或其他方公开，即使他们无法更改，这意味着你不应该在令牌中放置一些私秘的信息。**


## 5、为什么使用 JWT
让我们来谈谈JSON Web Tokens（JWT）与Simple Web Tokens（SWT）和Security Assertion Markup Language Tokens（SAML）相比的好处。

由于 JSON 比 XML 更简洁，因此在编码时它的大小也更小，使得 JWT 比 SAML 更紧凑，这也使得 JWT 成为在 HTML 和 HTTP 传递信息的不错选择。

在安全方面，SWT 只能使用 HMAC 算法通过共享密钥对称签名。但是，JWT 和 SAML 令牌可以使用 X.509 证书形式的公钥/私钥对进行签名，与简单的 JSON 签名相比，使用 XML 数字签名对 XML 进行签名而不会引入模糊的安全漏洞非常困难。

JSON 解析器在大多数语言中很常见，因为它们直接映射到对象。相反，XML 没有自然的文档到对象映射。这使得使用 JWT 比使用 SAML 断言更容易。

关于使用，JWT 用于互联网规模。这突出了在多个平台（尤其是移动平台）上轻松进行JSON Web Token 的客户端处理。
![JWT5](/images/jwt5.png)
比较编码的JWT和编码的SAML的长度。

## 总结
这篇文章是对 [官方文章](https://jwt.io/introduction) 的粗略（有些地方不太通顺）翻译，有助于自己对 JWT 有了初步的了解，接下来会结合各方资料学习使用一下。