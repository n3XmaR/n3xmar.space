---
title: MeerWatch
description: A personal cybersecurity news dashboard. An n8n workflow collects
  news from 9 sources every morning, ranks it by importance with rule-based
  scoring, and publishes it to a static site.
date: 2026-11-25
tags:
  - n8n
  - Docker
image: /images/projects/meerwatch.jpg
github: https://github.com/n3XmaR/MeerWatch
---
**Live site:** [https://n3xmar.github.io/MeerWatch/](https://n3xmar.github.io/MeerWatch/)

## The problem

A while ago I read a warning about a tool called Artex and realized that new vulnerabilities and tools show up every day, while I had no organized way to follow them. I kept hearing about important things late.

## What I built

- An n8n workflow (running in Docker) that runs every day at 7 AM and reads 9 sources: BleepingComputer, The Hacker News, Krebs on Security, SecurityWeek, CISA KEV, Cisco Talos, PortSwigger Research, SANS ISC and Kitploit.
- A rule-based scoring step that gives each item a category and an importance score from 1 to 10. Keywords like "zero-day" and "actively exploited" raise the score, promos lower it.
- An export step that publishes the result as `data.json` to GitHub, and a static site (HTML, CSS, JavaScript on GitHub Pages) with search, filters, a Top Threats section, and save/hide.

## Decisions

- **Rules instead of AI:** free, simple, and explainable. I can always say why an item got its score.
- **3-day window, 4-day memory:** a day of downtime doesn't lose news, and an old item never comes back looking new.
- **Dropped GitHub tool discovery:** results were noisy (fake-star repos), so I used Kitploit with a score cap.
- **Security:** n8n is never exposed to the internet. Feed text is displayed as plain text, not HTML. The GitHub token is limited to this one repository.

## The main challenge

My first scoring version put almost everything between 4 and 6, and an actively exploited Cisco flaw scored too low. It took three rounds of testing on real news until the ranking made sense.

## Limitations

- Rules don't understand context (a Cisco Expressway exploit was tagged Breach/Incident instead of Exploit).
- Several items can reach a score of 10 on busy days.
- The workflow only runs when my computer and Docker are on at 7 AM.

## My role

I built and tuned the n8n workflow and the scoring rules while learning n8n, with AI guidance. The front-end code was written with AI assistance.