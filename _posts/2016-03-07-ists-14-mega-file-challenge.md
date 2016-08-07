---
layout: post
title: ISTS 14 Mega File Challenge
---

This is a write-up for the Mega File web challenge during [SPARSA’s](http://sparsa.org/) [ISTS 14](http://ists.sparsa.org/).

Browsing to the IP given for the challenge (port 80) loaded the Mega File website:

[![Mega File website](/resources/ists14/1.PNG)](/resources/ists14/1.PNG)

I created an account and logged in, and was greeted with the site’s home page.

[![Mega File home page](/resources/ists14/2.PNG)](/resources/ists14/2.PNG)

The ‘Choose Account’ dropdown menu only had one account, which was my own (#6). Attempting to tamper with the parameter and show the files of a different user did not yield any results.

Browsing to the Share Files tab, I was able to find other users by both name and ID, and had the option to share files with them. I found the admin user by searching for user 1 and clicked the Share button.

[![Mega File share page](/resources/ists14/3.PNG)](/resources/ists14/3.PNG)

From there, I went back to the home page and changed the account parameter to 1. This listed the files in the admin’s account.

[![Files in the admin's account](/resources/ists14/4.PNG)](/resources/ists14/4.PNG)

The contents of the files were as follows:

credentials.txt:

`admin:MegafileR00lzdude`

suspicion.txt:

`one of my workers told me that jim bought the debug pin code from slugworth on kittencoin. we should probably have one of the techs change that pin and we need to look into the kittencoin site to see if they shared the pin on there or not, better get it off of there so no one else can get it`

Running a port scan on the IP revealed several other websites and services.

[![nmap output](/resources/ists14/5.PNG)](/resources/ists14/5.PNG)

Browsing to port 8000 revealed the KittenCoin website.

[![Kitten Coin website](/resources/ists14/6.PNG)](/resources/ists14/6.PNG)

I created an account and was greeted with KittenCoin’s home page.

[![Kitten Coin home page](/resources/ists14/7.PNG)](/resources/ists14/7.PNG)

The Lookup function allowed me to search for users by ID. I tried a basic SQL injection to enumerate all of the application’s users:

[![SQL Injection listing users](/resources/ists14/9.PNG)](/resources/ists14/9.PNG)

From there, I modified the SQL injection to get a better idea of the structure of the database. I started with the following injection to enumerate the tables, and columns within those tables, in the application:

```sql
1' union select table_name, column_name FROM information_schema.columns WHERE table_schema != 'mysql' AND table_schema != 'information_schema'; #
```

This returned the following results:

[![Columns and tables](/resources/ists14/10.PNG)](/resources/ists14/10.PNG)

I checked the values of the comments column in the transfers table to see if the PIN was stored there, and sure enough it was!

[![PIN stored in comments](/resources/ists14/11.PNG)](/resources/ists14/11.PNG)

Now that I had the PIN, I moved on to the next website (port 8080). This site was a random number generator implemented in Flask.

[![Random number generator](/resources/ists14/12.PNG)](/resources/ists14/12.PNG)

Entering purposefully malformed data (such as a lower bound that’s higher than the upper bound) would bring up the Werkzeug debug page.

[![Werkzeug debug page](/resources/ists14/13.PNG)](/resources/ists14/13.PNG)

There was an option to open an interactive console, which was protected by a PIN.

[![Prompt to enter PIN](/resources/ists14/14.PNG)](/resources/ists14/14.PNG)

Entering the PIN I just found on the KittenCoin site did the trick, and I now had a Python command shell!

[![Python command prompt](/resources/ists14/15.PNG)](/resources/ists14/15.PNG)

I used the subprocess module to run OS commands and store the results in a variable. Running an “ls -a” in the default directory listed the following files:

[![File output](/resources/ists14/16.PNG)](/resources/ists14/16.PNG)

The privkey file seemed fruitful, so I cat’ed the file to the output variable and printed it.

[![Private key output](/resources/ists14/17.PNG)](/resources/ists14/17.PNG)

So now I have an RSA private key, which will probably come in useful later on. Moving on to the final website, I found a simple login page.

[![Admin login prompt](/resources/ists14/18.PNG)](/resources/ists14/18.PNG)

I was able to log in using the credentials from credentials.txt, and was greeted with the following message:

[![Encrypted + base64-encoded message](/resources/ists14/19.PNG)](/resources/ists14/19.PNG)

Switching to Kali, I base64 decoded the text and stored it in a file, and also stored the private key in a separate file. Using openssl, I decrypted the ciphertext with the private key which revealed the flag.

[![Flag output](/resources/ists14/21.PNG)](/resources/ists14/21.PNG)

