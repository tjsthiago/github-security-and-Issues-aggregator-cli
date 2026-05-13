# 1. Sync release to hml

**Issue #2598**

**URL:** https://github.com/grupoboticario/pl-plataforma-logistica-fiscal-issuer/pull/2598

**Description:**

Este PR foi criado automaticamente para sincronizar a branch hml com a branch release.

---

# 2. System Information Leak: Internal

**Issue #2310**

**URL:** https://github.com/grupoboticario/pl-plataforma-logistica-fiscal-issuer/issues/2310

**Labels:** fortify, low

**Description:**

## Localização no código
https://github.com/grupoboticario/pl-plataforma-logistica-fiscal-issuer/blob/90bebfe9ca04ce63f6a3bc6c231d68d43f6d12d3/src/main/java/com/plataformalogistica/acoderefactoring/infra/driver/message/RequestNFSeIssuanceListener.java#L33
## Resumo (em inglês)
The function receive() in RequestNFSeIssuanceListener.java reveals system data or debug information by calling error() on line 33. The information revealed by error() could help an adversary form a plan of attack.


## Auditoria da issue
### Para auditar esta vulnerabilidade, comente nesta issue conforme o exemplo abaixo: 
`gandalf audit false-positive --description "<type your description here>"`
E clique no botão `Comment`.  
Issues fechadas manualmente com `Close With Comment` não serão auditadas pelo Gandalf e serão reabertas.
<details>
  <summary>Detalhes (em inglês)</summary>
  An internal information leak occurs when system data or debug information is sent to a local file, console, or screen via printing or logging.
In this case, <a href="event:file=src/main/java/com/plataformalogistica/acoderefactoring/infra/driver/message/RequestNFSeIssuanceListener.java&amp;lineNo=33" rel="nofollow">error()</a> is called in RequestNFSeIssuanceListener.java on line 33.


<b>Example 1:</b> The following code writes an exception to the standard error stream:

```
try {
    ...
} catch (Exception e) {
    e.printStackTrace();
}
```

Depending on the system configuration, this information can be dumped to a console, written to a log file, or exposed to a user. In some cases, the error message provides the attacker with the precise type of attack to which the system is vulnerable. For example, a database error message can reveal that the application is vulnerable to a SQL injection attack. Other error messages can reveal more oblique clues about the system. In <span class="code">Example 1</span>, the leaked information could imply information about the type of operating system, the applications installed on the system, and the amount of care that the administrators have put into configuring the program.

Information leaks are also a concern in a mobile computing environment.

<b>Example 2:</b> The following code logs the stack trace of a caught exception on the Android platform.
<span class="code">
...
try {
  ...
} catch (Exception e) {
    Log.e(TAG, Log.getStackTraceString(e));
}
...
</span>


  </details>
<details>
  <summary>Recomendações (em inglês)</summary>
  Write error messages with security in mind. In production environments, turn off detailed error information in favor of brief messages. Restrict the generation and storage of detailed output that can help administrators and programmers diagnose problems. Debug traces can sometimes appear in non-obvious places (embedded in comments in the HTML for an error page, for example).

Even brief error messages that do not reveal stack traces or database dumps can potentially aid an attacker. For example, an "Access Denied" message can reveal that a file or user exists on the system.


  </details>
<details>
    <summary>Referências (em inglês)</summary>
    [1] Ernst Haselsteiner and Klemens Breitfuss, Security in Near Field Communication (NFC): Strengths and Weaknesses, <a href="event:loc=http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.475.3812&amp;rep=rep1&amp;type=pdf" rel="nofollow">http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.475.3812&amp;rep=rep1&amp;type=pdf</a>

[2] ERR01-J. Do not allow exceptions to expose sensitive information, CERT, <a href="event:loc=https://www.securecoding.cert.org/confluence/display/java/ERR01-J.+Do+not+allow+exceptions+to+expose+sensitive+information" rel="nofollow">https://www.securecoding.cert.org/confluence/display/java/ERR01-J.+Do+not+allow+exceptions+to+expose+sensitive+information</a>

[3] ENV02-J. Do not trust the values of environment variables, CERT, <a href="event:loc=https://www.securecoding.cert.org/confluence/display/java/ENV02-J.+Do+not+trust+the+values+of+environment+variables" rel="nofollow">https://www.securecoding.cert.org/confluence/display/java/ENV02-J.+Do+not+trust+the+values+of+environment+variables</a>

[4] FUNDAMENTALS-4: Establish trust boundaries, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#0" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#0</a>

[5] CONFIDENTIAL-1: Purge sensitive information from exceptions, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#2" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#2</a>

[6] INPUT-1: Validate inputs, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#5" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#5</a>

[7] Fortify Taxonomy | System Information Leak: Internal, OpenText Fortify, <a href="event:loc=https://vulncat.fortify.com/en/detail?category=System+Information+Leak&amp;subcategory=Internal" rel="nofollow">https://vulncat.fortify.com/en/detail?category=System+Information+Leak&amp;subcategory=Internal</a>
    </details>
 
>  
> [!TIP]
> **Quer aprofundar seu entendimento sobre esta issue?** 🎓  
> Consulte o tutor interativo para uma explicação mais detalhada.  
>  
> **[Acessar a explicação desta issue](https://redirect-service.security.grupoboticario.digital/redirect?source=platform-gandalf&target=https%3A%2F%2Fgandalf.grupoboticario.com.br%2Fteacher%3Fowner%3Dgrupoboticario%26repository_name%3Dpl-plataforma-logistica-fiscal-issuer%26tool_name%3Dfortify%26issue_id%3D21937759)**

---

# 3. System Information Leak: Internal

**Issue #2309**

**URL:** https://github.com/grupoboticario/pl-plataforma-logistica-fiscal-issuer/issues/2309

**Labels:** fortify, low

**Description:**

## Localização no código
https://github.com/grupoboticario/pl-plataforma-logistica-fiscal-issuer/blob/90bebfe9ca04ce63f6a3bc6c231d68d43f6d12d3/src/main/java/com/plataformalogistica/acoderefactoring/infra/driven/client/apigee/ApigeeFeignClientGatewayImpl.java#L41
## Resumo (em inglês)
The function getToken() in ApigeeFeignClientGatewayImpl.java reveals system data or debug information by calling error() on line 41. The information revealed by error() could help an adversary form a plan of attack.


## Auditoria da issue
### Para auditar esta vulnerabilidade, comente nesta issue conforme o exemplo abaixo: 
`gandalf audit false-positive --description "<type your description here>"`
E clique no botão `Comment`.  
Issues fechadas manualmente com `Close With Comment` não serão auditadas pelo Gandalf e serão reabertas.
<details>
  <summary>Detalhes (em inglês)</summary>
  An internal information leak occurs when system data or debug information is sent to a local file, console, or screen via printing or logging.
In this case, <a href="event:file=src/main/java/com/plataformalogistica/acoderefactoring/infra/driven/client/apigee/ApigeeFeignClientGatewayImpl.java&amp;lineNo=41" rel="nofollow">error()</a> is called in ApigeeFeignClientGatewayImpl.java on line 41.


<b>Example 1:</b> The following code writes an exception to the standard error stream:

```
try {
    ...
} catch (Exception e) {
    e.printStackTrace();
}
```

Depending on the system configuration, this information can be dumped to a console, written to a log file, or exposed to a user. In some cases, the error message provides the attacker with the precise type of attack to which the system is vulnerable. For example, a database error message can reveal that the application is vulnerable to a SQL injection attack. Other error messages can reveal more oblique clues about the system. In <span class="code">Example 1</span>, the leaked information could imply information about the type of operating system, the applications installed on the system, and the amount of care that the administrators have put into configuring the program.

Information leaks are also a concern in a mobile computing environment.

<b>Example 2:</b> The following code logs the stack trace of a caught exception on the Android platform.
<span class="code">
...
try {
  ...
} catch (Exception e) {
    Log.e(TAG, Log.getStackTraceString(e));
}
...
</span>


  </details>
<details>
  <summary>Recomendações (em inglês)</summary>
  Write error messages with security in mind. In production environments, turn off detailed error information in favor of brief messages. Restrict the generation and storage of detailed output that can help administrators and programmers diagnose problems. Debug traces can sometimes appear in non-obvious places (embedded in comments in the HTML for an error page, for example).

Even brief error messages that do not reveal stack traces or database dumps can potentially aid an attacker. For example, an "Access Denied" message can reveal that a file or user exists on the system.


  </details>
<details>
    <summary>Referências (em inglês)</summary>
    [1] Ernst Haselsteiner and Klemens Breitfuss, Security in Near Field Communication (NFC): Strengths and Weaknesses, <a href="event:loc=http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.475.3812&amp;rep=rep1&amp;type=pdf" rel="nofollow">http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.475.3812&amp;rep=rep1&amp;type=pdf</a>

[2] ERR01-J. Do not allow exceptions to expose sensitive information, CERT, <a href="event:loc=https://www.securecoding.cert.org/confluence/display/java/ERR01-J.+Do+not+allow+exceptions+to+expose+sensitive+information" rel="nofollow">https://www.securecoding.cert.org/confluence/display/java/ERR01-J.+Do+not+allow+exceptions+to+expose+sensitive+information</a>

[3] ENV02-J. Do not trust the values of environment variables, CERT, <a href="event:loc=https://www.securecoding.cert.org/confluence/display/java/ENV02-J.+Do+not+trust+the+values+of+environment+variables" rel="nofollow">https://www.securecoding.cert.org/confluence/display/java/ENV02-J.+Do+not+trust+the+values+of+environment+variables</a>

[4] FUNDAMENTALS-4: Establish trust boundaries, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#0" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#0</a>

[5] CONFIDENTIAL-1: Purge sensitive information from exceptions, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#2" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#2</a>

[6] INPUT-1: Validate inputs, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#5" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#5</a>

[7] Fortify Taxonomy | System Information Leak: Internal, OpenText Fortify, <a href="event:loc=https://vulncat.fortify.com/en/detail?category=System+Information+Leak&amp;subcategory=Internal" rel="nofollow">https://vulncat.fortify.com/en/detail?category=System+Information+Leak&amp;subcategory=Internal</a>
    </details>
 
>  
> [!TIP]
> **Quer aprofundar seu entendimento sobre esta issue?** 🎓  
> Consulte o tutor interativo para uma explicação mais detalhada.  
>  
> **[Acessar a explicação desta issue](https://redirect-service.security.grupoboticario.digital/redirect?source=platform-gandalf&target=https%3A%2F%2Fgandalf.grupoboticario.com.br%2Fteacher%3Fowner%3Dgrupoboticario%26repository_name%3Dpl-plataforma-logistica-fiscal-issuer%26tool_name%3Dfortify%26issue_id%3D21937760)**

---

# 4. System Information Leak: Internal

**Issue #2142**

**URL:** https://github.com/grupoboticario/pl-plataforma-logistica-fiscal-issuer/issues/2142

**Labels:** fortify, low

**Description:**

## Localização no código
https://github.com/grupoboticario/pl-plataforma-logistica-fiscal-issuer/blob/58745de45762b5d76e7f3c6af5d308014c4b4721/src/main/java/com/plataformalogistica/acoderefactoring/infra/driver/resource/exception/handler/CustomResponseEntityExceptionHandler.java#L31
### Origem da Vulnerabilidade
https://github.com/grupoboticario/pl-plataforma-logistica-fiscal-issuer/blob/58745de45762b5d76e7f3c6af5d308014c4b4721/src/main/java/com/plataformalogistica/acoderefactoring/infra/driver/resource/exception/handler/CustomResponseEntityExceptionHandler.java#L44
> Esta é a origem (fonte) da vulnerabilidade. Mesmo que o problema seja detectado em outro arquivo, a correção deve ser aplicada aqui, onde os dados potencialmente perigosos entram no sistema.
**Dica:** verifique a pilha de chamadas deste método de origem. Isso ajudará na correção da vulnerabilidade.
## Resumo (em inglês)
The function handleGenericExceptions() in CustomResponseEntityExceptionHandler.java reveals system data or debug information by calling error() on line 31. The information revealed by error() could help an adversary form a plan of attack.


## Auditoria da issue
### Para auditar esta vulnerabilidade, comente nesta issue conforme o exemplo abaixo: 
`gandalf audit false-positive --description "<type your description here>"`
E clique no botão `Comment`.  
Issues fechadas manualmente com `Close With Comment` não serão auditadas pelo Gandalf e serão reabertas.
<details>
  <summary>Detalhes (em inglês)</summary>
  An internal information leak occurs when system data or debug information is sent to a local file, console, or screen via printing or logging.
In this case, <a href="event:file=src/main/java/com/plataformalogistica/acoderefactoring/infra/driver/resource/exception/handler/CustomResponseEntityExceptionHandler.java&amp;lineNo=31" rel="nofollow">error()</a> is called in CustomResponseEntityExceptionHandler.java on line 31.


<b>Example 1:</b> The following code writes an exception to the standard error stream:

```
try {
    ...
} catch (Exception e) {
    e.printStackTrace();
}
```

Depending on the system configuration, this information can be dumped to a console, written to a log file, or exposed to a user. In some cases, the error message provides the attacker with the precise type of attack to which the system is vulnerable. For example, a database error message can reveal that the application is vulnerable to a SQL injection attack. Other error messages can reveal more oblique clues about the system. In <span class="code">Example 1</span>, the leaked information could imply information about the type of operating system, the applications installed on the system, and the amount of care that the administrators have put into configuring the program.

Information leaks are also a concern in a mobile computing environment.

<b>Example 2:</b> The following code logs the stack trace of a caught exception on the Android platform.
<span class="code">
...
try {
  ...
} catch (Exception e) {
    Log.e(TAG, Log.getStackTraceString(e));
}
...
</span>


  </details>
<details>
  <summary>Recomendações (em inglês)</summary>
  Write error messages with security in mind. In production environments, turn off detailed error information in favor of brief messages. Restrict the generation and storage of detailed output that can help administrators and programmers diagnose problems. Debug traces can sometimes appear in non-obvious places (embedded in comments in the HTML for an error page, for example).

Even brief error messages that do not reveal stack traces or database dumps can potentially aid an attacker. For example, an "Access Denied" message can reveal that a file or user exists on the system.


  </details>
<details>
    <summary>Referências (em inglês)</summary>
    [1] Ernst Haselsteiner and Klemens Breitfuss, Security in Near Field Communication (NFC): Strengths and Weaknesses, <a href="event:loc=http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.475.3812&amp;rep=rep1&amp;type=pdf" rel="nofollow">http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.475.3812&amp;rep=rep1&amp;type=pdf</a>

[2] ERR01-J. Do not allow exceptions to expose sensitive information, CERT, <a href="event:loc=https://www.securecoding.cert.org/confluence/display/java/ERR01-J.+Do+not+allow+exceptions+to+expose+sensitive+information" rel="nofollow">https://www.securecoding.cert.org/confluence/display/java/ERR01-J.+Do+not+allow+exceptions+to+expose+sensitive+information</a>

[3] ENV02-J. Do not trust the values of environment variables, CERT, <a href="event:loc=https://www.securecoding.cert.org/confluence/display/java/ENV02-J.+Do+not+trust+the+values+of+environment+variables" rel="nofollow">https://www.securecoding.cert.org/confluence/display/java/ENV02-J.+Do+not+trust+the+values+of+environment+variables</a>

[4] FUNDAMENTALS-4: Establish trust boundaries, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#0" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#0</a>

[5] CONFIDENTIAL-1: Purge sensitive information from exceptions, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#2" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#2</a>

[6] INPUT-1: Validate inputs, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#5" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#5</a>

[7] Fortify Taxonomy | System Information Leak: Internal, OpenText Fortify, <a href="event:loc=https://vulncat.fortify.com/en/detail?category=System+Information+Leak&amp;subcategory=Internal" rel="nofollow">https://vulncat.fortify.com/en/detail?category=System+Information+Leak&amp;subcategory=Internal</a>
    </details>
 
>  
> [!TIP]
> **Quer aprofundar seu entendimento sobre esta issue?** 🎓  
> Consulte o tutor interativo para uma explicação mais detalhada.  
>  
> **[Acessar a explicação desta issue](https://redirect-service.security.grupoboticario.digital/redirect?source=platform-gandalf&target=https%3A%2F%2Fgandalf.grupoboticario.com.br%2Fteacher%3Fowner%3Dgrupoboticario%26repository_name%3Dpl-plataforma-logistica-fiscal-issuer%26tool_name%3Dfortify%26issue_id%3D20818423)**

---

# 5. System Information Leak: Internal

**Issue #1936**

**URL:** https://github.com/grupoboticario/pl-plataforma-logistica-fiscal-issuer/issues/1936

**Labels:** fortify, low

**Description:**

## Localização no código
https://github.com/grupoboticario/pl-plataforma-logistica-fiscal-issuer/blob/b6cac0235fa4e502cef7ecd3b169621b507aad0d/src/main/java/com/plataformalogistica/entrypoint/resource/v1/FiscalDocumentNFSeWebhookResource.java#L76
## Resumo (em inglês)
The function emissionDocument() in FiscalDocumentNFSeWebhookResource.java reveals system data or debug information by calling error() on line 76. The information revealed by error() could help an adversary form a plan of attack.


## Auditoria da issue
### Para auditar esta vulnerabilidade, comente nesta issue conforme o exemplo abaixo: 
`gandalf audit false-positive --description "<type your description here>"`
E clique no botão `Comment`.  
Issues fechadas manualmente com `Close With Comment` não serão auditadas pelo Gandalf e serão reabertas.
<details>
  <summary>Detalhes (em inglês)</summary>
  An internal information leak occurs when system data or debug information is sent to a local file, console, or screen via printing or logging.
In this case, <a href="event:file=src/main/java/com/plataformalogistica/entrypoint/resource/v1/FiscalDocumentNFSeWebhookResource.java&amp;lineNo=76" rel="nofollow">error()</a> is called in FiscalDocumentNFSeWebhookResource.java on line 76.


<b>Example 1:</b> The following code writes an exception to the standard error stream:

```
try {
    ...
} catch (Exception e) {
    e.printStackTrace();
}
```

Depending on the system configuration, this information can be dumped to a console, written to a log file, or exposed to a user. In some cases, the error message provides the attacker with the precise type of attack to which the system is vulnerable. For example, a database error message can reveal that the application is vulnerable to a SQL injection attack. Other error messages can reveal more oblique clues about the system. In <span class="code">Example 1</span>, the leaked information could imply information about the type of operating system, the applications installed on the system, and the amount of care that the administrators have put into configuring the program.

Information leaks are also a concern in a mobile computing environment.

<b>Example 2:</b> The following code logs the stack trace of a caught exception on the Android platform.
<span class="code">
...
try {
  ...
} catch (Exception e) {
    Log.e(TAG, Log.getStackTraceString(e));
}
...
</span>


  </details>
<details>
  <summary>Recomendações (em inglês)</summary>
  Write error messages with security in mind. In production environments, turn off detailed error information in favor of brief messages. Restrict the generation and storage of detailed output that can help administrators and programmers diagnose problems. Debug traces can sometimes appear in non-obvious places (embedded in comments in the HTML for an error page, for example).

Even brief error messages that do not reveal stack traces or database dumps can potentially aid an attacker. For example, an "Access Denied" message can reveal that a file or user exists on the system.


  </details>
<details>
    <summary>Referências (em inglês)</summary>
    [1] Ernst Haselsteiner and Klemens Breitfuss, Security in Near Field Communication (NFC): Strengths and Weaknesses, <a href="event:loc=http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.475.3812&amp;rep=rep1&amp;type=pdf" rel="nofollow">http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.475.3812&amp;rep=rep1&amp;type=pdf</a>

[2] ERR01-J. Do not allow exceptions to expose sensitive information, CERT, <a href="event:loc=https://www.securecoding.cert.org/confluence/display/java/ERR01-J.+Do+not+allow+exceptions+to+expose+sensitive+information" rel="nofollow">https://www.securecoding.cert.org/confluence/display/java/ERR01-J.+Do+not+allow+exceptions+to+expose+sensitive+information</a>

[3] ENV02-J. Do not trust the values of environment variables, CERT, <a href="event:loc=https://www.securecoding.cert.org/confluence/display/java/ENV02-J.+Do+not+trust+the+values+of+environment+variables" rel="nofollow">https://www.securecoding.cert.org/confluence/display/java/ENV02-J.+Do+not+trust+the+values+of+environment+variables</a>

[4] FUNDAMENTALS-4: Establish trust boundaries, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#0" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#0</a>

[5] CONFIDENTIAL-1: Purge sensitive information from exceptions, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#2" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#2</a>

[6] INPUT-1: Validate inputs, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#5" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#5</a>

[7] Fortify Taxonomy | System Information Leak: Internal, OpenText Fortify, <a href="event:loc=https://vulncat.fortify.com/en/detail?category=System+Information+Leak&amp;subcategory=Internal" rel="nofollow">https://vulncat.fortify.com/en/detail?category=System+Information+Leak&amp;subcategory=Internal</a>
    </details>

---

# 6. System Information Leak: Internal

**Issue #1773**

**URL:** https://github.com/grupoboticario/pl-plataforma-logistica-fiscal-issuer/issues/1773

**Labels:** fortify, low

**Description:**

## Localização no código
https://github.com/grupoboticario/pl-plataforma-logistica-fiscal-issuer/blob/d68ce79bf78caee03e89c78b11bf0bc6e717fe42/src/main/java/com/plataformalogistica/core/usecase/ProcessCTeNormalUseCase.java#L80
## Resumo (em inglês)
The function execute() in ProcessCTeNormalUseCase.java reveals system data or debug information by calling warn() on line 80. The information revealed by warn() could help an adversary form a plan of attack.


## Auditoria da issue
### Para auditar esta vulnerabilidade, comente nesta issue conforme o exemplo abaixo: 
`gandalf audit false-positive --description "<type your description here>"`
E clique no botão `Comment`.  
Issues fechadas manualmente com `Close With Comment` não serão auditadas pelo Gandalf e serão reabertas.
<details>
  <summary>Detalhes (em inglês)</summary>
  An internal information leak occurs when system data or debug information is sent to a local file, console, or screen via printing or logging.
In this case, <a href="event:file=src/main/java/com/plataformalogistica/core/usecase/ProcessCTeNormalUseCase.java&amp;lineNo=80" rel="nofollow">warn()</a> is called in ProcessCTeNormalUseCase.java on line 80.


<b>Example 1:</b> The following code writes an exception to the standard error stream:

```
try {
    ...
} catch (Exception e) {
    e.printStackTrace();
}
```

Depending on the system configuration, this information can be dumped to a console, written to a log file, or exposed to a user. In some cases, the error message provides the attacker with the precise type of attack to which the system is vulnerable. For example, a database error message can reveal that the application is vulnerable to a SQL injection attack. Other error messages can reveal more oblique clues about the system. In <span class="code">Example 1</span>, the leaked information could imply information about the type of operating system, the applications installed on the system, and the amount of care that the administrators have put into configuring the program.

Information leaks are also a concern in a mobile computing environment.

<b>Example 2:</b> The following code logs the stack trace of a caught exception on the Android platform.
<span class="code">
...
try {
  ...
} catch (Exception e) {
    Log.e(TAG, Log.getStackTraceString(e));
}
...
</span>


  </details>
<details>
  <summary>Recomendações (em inglês)</summary>
  Write error messages with security in mind. In production environments, turn off detailed error information in favor of brief messages. Restrict the generation and storage of detailed output that can help administrators and programmers diagnose problems. Debug traces can sometimes appear in non-obvious places (embedded in comments in the HTML for an error page, for example).

Even brief error messages that do not reveal stack traces or database dumps can potentially aid an attacker. For example, an "Access Denied" message can reveal that a file or user exists on the system.


  </details>
<details>
    <summary>Referências (em inglês)</summary>
    [1] Ernst Haselsteiner and Klemens Breitfuss, Security in Near Field Communication (NFC): Strengths and Weaknesses, <a href="event:loc=http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.475.3812&amp;rep=rep1&amp;type=pdf" rel="nofollow">http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.475.3812&amp;rep=rep1&amp;type=pdf</a>

[2] ERR01-J. Do not allow exceptions to expose sensitive information, CERT, <a href="event:loc=https://www.securecoding.cert.org/confluence/display/java/ERR01-J.+Do+not+allow+exceptions+to+expose+sensitive+information" rel="nofollow">https://www.securecoding.cert.org/confluence/display/java/ERR01-J.+Do+not+allow+exceptions+to+expose+sensitive+information</a>

[3] ENV02-J. Do not trust the values of environment variables, CERT, <a href="event:loc=https://www.securecoding.cert.org/confluence/display/java/ENV02-J.+Do+not+trust+the+values+of+environment+variables" rel="nofollow">https://www.securecoding.cert.org/confluence/display/java/ENV02-J.+Do+not+trust+the+values+of+environment+variables</a>

[4] FUNDAMENTALS-4: Establish trust boundaries, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#0" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#0</a>

[5] CONFIDENTIAL-1: Purge sensitive information from exceptions, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#2" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#2</a>

[6] INPUT-1: Validate inputs, Oracle, <a href="event:loc=http://www.oracle.com/technetwork/java/seccodeguide-139067.html#5" rel="nofollow">http://www.oracle.com/technetwork/java/seccodeguide-139067.html#5</a>

[7] Fortify Taxonomy | System Information Leak: Internal, OpenText Fortify, <a href="event:loc=https://vulncat.fortify.com/en/detail?category=System+Information+Leak&amp;subcategory=Internal" rel="nofollow">https://vulncat.fortify.com/en/detail?category=System+Information+Leak&amp;subcategory=Internal</a>
    </details>
