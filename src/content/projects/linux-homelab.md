---
title: Sponge - My HomeLab
description: "An old laptop turned into a self-hosted music server and media
  center using Ubuntu Server, Python, and Docker. "
date: 2026-02-04
tags:
  - Linux
  - Docker
  - Python
  - Self-Hosting
  - Networking
image: /images/projects/sponge/homelab.png
---
I found an old laptop sitting around and decided to turn it into something useful.

Since I spend a lot of time listening to music while working, my first idea was to build my own music server.

That's how Sponge started.

## Part 1 - The Music Server

I installed Ubuntu Server on the laptop and started building a self-hosted music setup.

I wrote a Python script connected to a Telegram bot, allowing me to send song names or links and manage music requests through Telegram.

For the music library, I used **Navidrome** to organize and stream my music. I also set up VPN access so I could connect to my HomeLab remotely.

## Part 2 - The Media Center

After getting the music server working, I decided to expand Sponge into a media center for movies and TV shows.

I used **Docker** to deploy and manage multiple services:

- **Prowlarr:** Manages search indexers.
- **Radarr:** Handles movie library management and automation.
- **Sonarr:** Manages TV series and episodes.
- **Bazarr:** Manages subtitles.
- **Jellyseerr:** Provides an interface for requesting media.
- **Jellyfin:** Organizes and streams the media library.

By connecting these services, I built a system where media requests, library management, and streaming could work together with minimal manual intervention.

![](/images/projects/sponge/sponge-jellyseerr.jpg)



![](/images/projects/sponge/sponge-jellyfin.jpg)

## What I Learned

Sponge gave me hands-on experience with Linux server administration, Docker, Python automation, networking, remote access, and self-hosting.

I also learned more about deploying services, managing containers, and getting different applications to communicate with each other.

What started as a simple music server eventually turned into a much bigger HomeLab project, all running on an old laptop.