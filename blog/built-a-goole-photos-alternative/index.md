---
layout: blog.liquid
title: How I built a goole photos alternative
description: After four years of working as a designer in the marketing department of a linux distro, he finally tries linux.
tags: 
  - post
  - journal
  - privacy
  - digital sovereignty
date: 2026-01-09
---



## The problem



Getting off google, off facebook, off insta, off big tech mobile maps have been simmering low on the back burner for years. I’d take a few steps, but never rip off the bandaid. The attempt I’m writing about is my biggest step yet. 

I wanted all the good parts of Google Photos — the fast, clean interface, drag-and-drop uploads, and smart search — without the Google part. I wanted data sovereignty, as the privacy crowd calls it, meaning your bits live on your hardware, not on someone else’s server farm. My metric for success was not seeing recurring subscription fees for my photo library on my credit card. 

This whole thing became a possibility while conversing with a robot in the snow. I was going for a walk in the local woods when I decided to pitch my problem to AI to see how feasible a proof of concept would be. I’d scanned blogs about home NAS (Network Attached Storage) servers, but always hesitated because I imagined wasted hours; frustrated, troubleshooting, getting stuck, and finally giving up. But AI suggested a cheap way through with a raspberryPi + existing harddrives.

So, I begrudgingly accepted claude as a guide and continued on.

## Attempt 1: old macbook (8 hours)

So Raspberry Pis aren’t the value they used to be. I scratched that idea, but the door of interest was opened.

I dug out the 2012 MacBook that was sitting among books and I wiped it clean. Then downloaded Ubuntu Server and flashed it to a USB drive using Balena Etcher, then installed it on the old machine. This was my first time installing a server operating system. I often use the terminal when editing my 11ty site, but this still felt foreign: text-based installers, no mouse, navigating with arrow keys and tab through config screens.

Getting WiFi working took longer. The laptop's WiFi chip needed drivers that Ubuntu didn't include by default. I spent an hour editing network config files, installing driver packages, and restarting network services until finally \- SSH access from my main computer. This was my magical <em>"hello world"</em> moment. 

I installed Docker, got Immich (the open source photo app I'd decided on) running, formatted the external drives, and started importing photos. Whoa, I'd actually pulled this off.

Then, no. 

Under sustained write load of generating thumbnails for thousands of photos, the external drives would drop power. The exFAT filesystem would detect errors and switch to read-only mode. Immich would crash. I'd remount the drives, restart everything, and the cycle would repeat. After hours of trying different USB ports, different filesystems, and different configs, I accepted that the old USB ports couldn't power modern 2TB drives during intensive operations. 

I wish AI could have foreseen the macbook hardware glitches (anger emoji).

## Attempt 2: purpose-built hardware (4 hours)

So my fears came to pass. I was troubleshooting this thing to dry eyeballs during my vacation time. I can’t say it wasn’t somewhat enjoyable though. 

I researched and ordered a new computer, landing on a GEEKOM Mini Air12 Lite, a modern mini PC with proper USB power delivery. It was more bang for my buck than a Pi. I planned to reuse the previous software (Ubuntu Server, Immich) and hardware (2x 2TB external drives) from attempt 1\. 

The mini PC arrived. 

In the meantime I'd learned [TrueNAS](https://www.truenas.com) was the "right" tool for the job over the bulkier, more general purpose Ubuntu. It’s a specialized operating system designed for network-attached storage. Also, it has a web GUI for everything, meaning less terminal work. But, no. TrueNAS didn't detect GEEKOM's ethernet or wifi at all \- the ethernet controller wasn't supported out of the box. After an hour of troubleshooting (checking BIOS, loading drivers manually, etc.), I bailed and went back to Ubuntu. 

Again, I wish AI could have foreseen the common internet issues with TrueNAS \+ my hardware (anger emoji).

So I went through the same Ubuntu installation as before, but this time everything worked. WiFi drivers loaded immediately, with no need to use ethernet firstly. Docker installed without a hitch. Within two hours I had Ubuntu running and Immich deployed and accessible from my browser. 

I set up Samba for network file sharing so the drives appear in Finder like any network storage. Then copied 57GB of photos over WiFi (some from Google Photos exports, others from local backups). 

Then I watched thousands of photos being indexed (sweet relief emoji).

Here's the current tech stack:

* **Hardware:** GEEKOM Mini Air12 Lite (Intel N100, 16GB RAM, 512GB SSD)  
* **Storage:** 2x Seagate Backup Plus Slim 2TB (USB 3.0)  
* **OS:** Ubuntu Server 24.04 LTS  
* **Containerization:** Docker \+ Docker Compose  
* **Photo mgmt:** [Immich](https://immich.app/) v2.3.1  
* **File Sharing:** Samba  
* **Network:** Static IP via netplan, SSH access  
* **Backup Strategy:** rsync to second drive (nightly automated)

And what it does. It's a home photo server that:

<ul class="checks">
<li>Stores and organizes 60,000+ family photos</li>
<li>Generates thumbnails and metadata</li>
<li>Has a Google Photos-like interface via web browser</li>
<li>Auto-backs up photos from my phone via mobile app</li>
<li>Is accessible from anywhere</li>
<li>Has no monthly fees, no cloud dependence</li>
<li>Has complete data sovereignty</li>
</ul>

<br />

After days of troubleshooting and a machine swap, my private GPhotos clone was alive.


## Learning, what is it again?

During this time of copy and pasting commands from claude into terminal, I had this sense that this was the future. A constant open conversation with a generative AI tool. But, I wondered how much I was learning. If we consider memorizing commands learning, I wasn’t doing that. If understanding the steps in the process is learning, I was partially doing that. I had claude explain what each line meant, but my memory of it is such a blur of that time I question how much I retained. Maybe writing a blog about an AI experience is required for learning, because writing this post is bringing much of it back.

I was uneasy about my reliance on it. But I suppose that’s not new. It’s like tightly relying on the manual in the middle of repairing your first engine.

Overall, this brought <em>major</em> concepts that get discussed at work into focus. Buzzwords were given meaning and richness. And yes, I understand Red Hat users a fraction more.

Plus, I did a hard technical thing outside my comfort zone. That feels worth more than the $300 I saved vs buying a [Synology](https://www.synology.com/en-us/products/DS425+) (the prebuilt system that does all this out of the box). 

To reveiw, I learned about:

* Containerization, like mounting and persistent storage   
* Linux, like filesystems and command-line installation and configuration  
* How software can't overcome fundamental hardware limitations  
* Networking, like SSH   
* Hardware troubleshooting  
* Very generally, the role of a sysadmin

## What next?
I need to complete the in-progress tasks:
* Finalizing Google Photos export import  
* Onboarding my partner's photos and devices

Then move to the final steps: 
* Set up off-site backup  
* Add Pi-hole to block ads and trackers at the network level  
* Explore VPN for remote access  
* Maybe add Jellyfin for video streaming

<br />
Join me in seizing the means of computation. 