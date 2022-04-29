---
layout: post
title: 2016 Flare-On Challenge Write-Up
---

I had a chance to test my reverse engineering skills in FireEye's Flare-On challenge this year. While I didn't get very far, I was still able to learn a ton and sharpen my skills for next year. All of the challenges are available on the [Flare-On website](http://flare-on.com/files/Flare-On3_Challenges.zip), so feel free to follow along. With that said, let's jump ~~over that function call~~ into the solutions!

## Challenge 1

Starting off, we're given a challenge1.exe binary. Running the binary will prompt the user for a password:

![Incorrect password]({% link /resources/flareon2016/1.PNG %})

Let's take a closer look at the binary. Loading the challenge into Binary Ninja, we can quickly locate the strings used when comparing the passwords:

![Comparison strings]({% link /resources/flareon2016/2.PNG %})

Looking at the cross-references to the "Enter password" string, we can jump to the password comparison function. Near the comparison itself, the string "x2dtJEOmyjacxDemx2eczT5cVS9fVUGvWTuZWjuexjRqy24rV29q" is pushed to the stack.

![Pushing string to stack]({% link /resources/flareon2016/3.PNG %})

This looks fruitful! Let's try entering this as the password:

![Wrong!]({% link /resources/flareon2016/4.PNG %})

Dang, no dice! Let's use a debugger to see what's actually being compared. By setting a breakpoint on the function called just before the comparison, then entering the password "test", we see the string "aDSwaZ==" is passed to the function instead of our original input.

![Debugger view]({% link /resources/flareon2016/5.PNG %})

The double equals sign on the end of the string is a dead giveaway for a base64-encoded string. It looks like the program is base64-encoding our input, then comparing it to the comparison string (x2dtJEOmyjacxDemx2eczT5cVS9fVUGvWTuZWjuexjRqy24rV29q). If we base64-decode the comparision string, we'll know the correct input to enter. Using a [base64 decoder](http://tomeko.net/online_tools/base64.php?lang=en_), let's see what our comparison value decodes to:

![Decoded gobbledegook]({% link /resources/flareon2016/6.PNG %})

Huh, that doesn't look right. There's a lot of bytes outside the ASCII byte range. It looks like there's something fishy going on here...

To understand what's going on, I needed to do a bit of research about base64. I was looking at an [example implementation](https://en.wikipedia.org/wiki/Base64#Sample_Implementation_in_Java) of a base64 algorithm when I saw the following line of code:

```java
private static final String CODES = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
```

This looks like an alphabet that's designed to be easily changed. Curious, I scrolled up on the page and found the [following information](https://en.wikipedia.org/wiki/Base64#Design):

>The particular set of 64 characters chosen to represent the 64 place-values for the base varies between implementations. The general strategy is to choose 64 characters that are both members of a subset common to most encodings, and also printable.

So it looks like this alphabet is changeable! Going back to the strings in the binary, we can quickly identify a 64-character value that looks like another alphabet:

![Alternative base64 alphabet]({% link /resources/flareon2016/7.PNG %})

A quick Google search reveals a [tool](https://www.malwaretracker.com/decoder_base64.php) that can perform base64 encodings with alternative alphabets for us. Entering the custom alphabet we just found and our comparison string returns "sh00ting_phish_in_a_barrel@flare-on.com" as output. This looks like our flag! Let's give it a try:

![Correct!]({% link /resources/flareon2016/8.PNG %})

Sweet! Entering the password on the Flare-On website moves us on to the next challenge.

## Challenge 2

The next challenge is aptly named DudeLocker.exe, with an included BusinessPapers.doc that appears to be encrypted. Upon inspecting the binary in Binja, we can see there are several initial checks that must be passed.

The first of which involves a call to [SHGetFolderPath](https://msdn.microsoft.com/en-us/library/windows/desktop/bb762181(v=vs.85).aspx), which retrieves the paths of special system folders and returns 0 if the operation was successful.

![Call to SHGetFolderPath]({% link /resources/flareon2016/9.PNG %})

The 2nd parameter being passed to SHGetFolderPath (the 4th value pushed to the stack), 0x10, is a CSIDL value identifying the folder being retrieved. A quick [lookup](http://www.installmate.com/support/im9/using/symbols/functions/csidls.htm) reveals CSIDL 0x10 corresponds to the user's desktop directory. So, this function attempt will grab the path of the desktop, and the program will continue if the operation was successful.

The next block checks if the length of our retrieved desktop path is less than or equal to 0xf8, or 248 in decimal. If so, the program continues; otherwise, it returns.

![Checking desktop path length]({% link /resources/flareon2016/10.PNG %})

Afterwards, we see a block with a call to CreateFile at the end. [CreateFile](https://msdn.microsoft.com/en-us/library/windows/desktop/aa363858(v=vs.85).aspx), according to MSDN, "creates or opens a file or I/O device". Despite its name, the I/O devices it works with are not limited to files; it also works with file streams, directories, physical disks, volumes, etc. The function takes the name of the I/O device as a parameter (the last value pushed to the stack), followed by 6 additional parameters describing the device's attributes.

![Showing call to CreateFile]({% link /resources/flareon2016/11.PNG %})

The filename parameter (var_244) is constructed earlier in the block. We see it's being passed to sub_401000 along with var_44c, which contains our desktop path from earlier, and var_3c, which contains the string "Briefcase". The subroutine will concatenate "\Briefcase" to our desktop path, which is then used in the CreateFile call.

So CreateFile will attempt to open an I/O device located on our desktop named Briefcase. For more information, let's take a look at the additional parameters. dwDesiredAccess is set to 0x80000000 (GENERIC_READ), dwShareMode is set to 0x1 (FILE_SHARE_READ), lpSecurityAttributes is set to 0, dwCreationDisposition is set to 0x3 (OPEN_EXISTING), and dwFlagsAndAttributes is set to 0x02000000 (FILE_FLAG_BACKUP_SEMANTICS). There's an important note alongside FILE_FLAG_BACKUP_SEMANTICS: "You must set this flag to obtain a handle to a directory."

It looks like CreateFile is attempting to open an existing directory named Briefcase located on our desktop. If this operation fails, an error code of 0xffffffff is returned (INVALID_HANDLE_VALUE), which will print a taunting message and exit the program. Otherwise, we proceed onwards.

The next check lands us in a subroutine that calls [GetVolumeInformation](https://msdn.microsoft.com/en-us/library/windows/desktop/aa364993(v=vs.85).aspx) to retrieve the serial number of our root (C:) volume. This was deduced by tracing the parameters as we just did above, which is left as an exercise to the reader. The serial number is compared to the value 0x7dab1d35 ("**T**he **D**ude Abides") -- if they aren't equal, eax is cleared; otherwise, eax remains.

![Block comparing serial number]({% link /resources/flareon2016/12.PNG %})

We need eax != 0 to pass this check, so we'll have to either change our C volume's serial number or bypass this check with a debugger. I opted to use the handy [VolumeID](https://technet.microsoft.com/en-us/sysinternals/bb897436.aspx) from Sysinternals to change the volume's serial. (Did I mention it's important to work on these in a VM?)

Let's try running the binary at this point. We're greeted with a ransom note in the briefcase that rudely replaced my [desktop background](http://i.imgur.com/vcgZMgU.jpg):

![Ransom note]({% link /resources/flareon2016/ve_vant_ze_money.jpg %})

Looks like they want a million Bitcoins. Maybe those business papers will suffice? Let's drop BusinessPapers.doc in the Briefcase aaaaand...

![BusinessPapers still encrypted]({% link /resources/flareon2016/13.PNG %})

Dang, still encrypted. However, the Last Modified date on the file changed, so DudeLocker must have done _something_ with it. Taking another look at the binary reveals calls to CryptEncrypt in the program's Import Address Table:

![CryptEncrypt in IAT]({% link /resources/flareon2016/14.PNG %})

This makes sense, since our modified BusinessPapers.doc still appears to be encrypted. However, the IAT doesn't seem to have any entries for a decryption function. Taking a look at [CryptEncrypt](https://msdn.microsoft.com/en-us/library/windows/desktop/aa379924(v=vs.85).aspx) quickly points us to [CryptDecrypt](https://msdn.microsoft.com/en-us/library/windows/desktop/aa379913(v=vs.85).aspx), which uses the same arguments sans dwBufLen at the end. If we could patch the call to CryptEncrypt with a call to CryptDecrypt, we might be able to decrypt the contents of the BusinessPapers!

Let's take another look at the IAT. The entry for CryptEncrypt is 0x24fa, which refers to an offset in the DudeLocker binary. If we add that to the image base of 0x400000, we get 0x4024fa. Inspecting the binary at 0x04024fa reveals the following:

![Binary contents at 0x4024fa]({% link /resources/flareon2016/15.PNG %})

Hmm, looks like there's another offset (0x00ba) followed by "CryptEncrypt" in ASCII. To make sense of what we're looking at, I loaded the Windows DLL containing CryptEncrypt (advapi32.dll) in Dependency Walker and found the exported CryptEncrypt function:

![Dependency Walker output for CryptEncrypt]({% link /resources/flareon2016/16.PNG %})

Aha! It looks like 0x00ba was referring to the function's [hint](http://win32assembly.programminghorizon.com/pe-tut6.html), which contains the index for that function in the DLL's export table. The hint for CryptDecrypt is 0x00b4. Are you thinking what I'm thinking??

![Patching the binary IAT]({% link /resources/flareon2016/17.PNG %})

Well, you are now. Patching the IAT allowed us to decrypt the file instead of encrypting it! The file still doesn't look like a DOC file, but if we open it in a hex editor, we see the initial bytes FF D8 FF E0. A quick Google search reveals that's the [file signature](https://www.filesignatures.net/index.php?page=search&search=FFD8FFE0&mode=SIG) for a JPEG image. Changing the file type from .doc to .jpg reveals our flag:

![Victory at last!]({% link /resources/flareon2016/BusinessPapers.jpg %})
