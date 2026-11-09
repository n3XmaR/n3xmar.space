---
title: GhostPass
description: A Python CLI password manager prototype with SQLite storage,
  password generation, and RockYou wordlist checks.
date: 2026-01-05
tags:
  - Python
  - Security
  - CLI
image: /images/projects/ghostpass/ghostpass.png
github: https://github.com/n3XmaR/GhostPass
---
# GhostPass 👻

After learning Python, I wanted to put what I'd learned into practice.

So I built GhostPass, a simple CLI password manager using Python.

![](/images/projects/ghostpass/ghostpass-cli.png)

## Features

- Store, update, delete, and view passwords using a local SQLite database.
- Generate random passwords using Python's `secrets` module.
- Check passwords against the RockYou wordlist.
- Obfuscate stored passwords using XOR and Base64.

![](/images/projects/ghostpass/ghostpass-leak.png)

## What I Learned

This project helped me practice Python, SQLite, CLI development, and basic password management concepts.

I also learned an important distinction: making something work doesn't necessarily make it secure.

**Note:** GhostPass is an educational prototype, not a production-ready password manager. Its XOR-based storage and SQL queries need security improvements before it could be used with real credentials.

## Source Code

[View on GitHub](https://github.com/n3XmaR/GhostPass)