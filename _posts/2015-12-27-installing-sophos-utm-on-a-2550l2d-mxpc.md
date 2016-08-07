---
layout: post
title: Installing Sophos UTM on a 2550L2D-MxPC
---

One of my projects over the break was to install the free version of Sophos UTM and play around with its features a bit. Newegg has a convenient [barebones PC](http://www.newegg.com/Product/Product.aspx?Item=N82E16856205007) with dual NICs that’s perfect for deploying firewalls. The only problem is UTM is intended to be installed using a CD, and the barebones PC doesn’t come with a CD drive. Many people prefer to install using a live USB, but getting it to work with UTM is a bit tricky. There were a lot of people having issues on the Astaro forums (Sophos UTM was formerly Astaro Security Gateway), so this post is my attempt to streamline the install process for the 2550L2D-MxPC.

I took the following steps to install:

1. Download UTM from the [Sophos support page](https://www.sophos.com/en-us/support/utm-downloads.aspx). Make sure you download the software version (starts with ASG), not the hardware version.
2. Write UTM to the USB drive. I used Rufus, but other programs do the job too.
3. Eject the USB drive and insert it in the barebones PC.
4. Power on the PC and tap Delete until the BIOS appears.
5. Navigate to the Boot tab and rearrange the Boot Option Priorities so that ‘Generic Flash Disk’ is on top.
6. Save and exit the BIOS. The system should boot into the UTM installer, press Enter.
7. The introduction page will appear. Before starting with the installation, press Alt+F2 to bring up the console.
8. Type ‘mount /dev/sdb1 /install’ and hit Enter.
9. Press Alt+F1 to return to the installer. Continue with the installation as normal.

The mount command essentially puts the install files (on the USB) in the directory that UTM uses during the installation process. Once the files are in the /install directory, UTM will have no trouble locating the install files and proceeding with the installation. This fixed the “install.tar wasn’t found on the installation media” error that prevents the installation from completing.

When the installation is finished, eject the USB drive and reboot the machine. UTM is now loaded and ready to be configured.
