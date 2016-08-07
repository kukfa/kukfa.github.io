---
layout: page-nomenu
title: Web Application Cheat Sheet
menu: no
---

The aim of this page is to provide a quick overview of web application security issues. Most sections are divided into 4 main components: describing/background, finding, exploiting, and fixing. Many examples came from [The Web Application Hacker’s Handbook](http://www.amazon.com/The-Web-Application-Hackers-Handbook/dp/1118026470) and [OWASP](https://www.owasp.org/index.php/Main_Page); I recommend checking both out! My goal is to continually update this page as my understanding of web security evolves. Feel free to share any questions, feedback, or suggestions.

XSS
===

What is it
----------

-   Ability of an attacker to input HTML/script that runs in the
    victim’s browser
-   Attacks target the *user*, not the server
-   Reflected
    -   user visits malicious URL supplied by attacker, malicious input
        is sent to server in a request, and is returned in the response
        and subsequently processed/executed in victim’s browser
    -   example: attacker sends victim a link with the payload as a
        parameter
        -   http://www.vulnerable.app/printText.php?text=&lt;script&gt;alert(1)&lt;/script&gt;
-   Stored
    -   malicious input is sent to server in a request, and is returned
        to and executed by every user that loads that page
    -   example: comment page on a blog
        -   attacker comments: &lt;script&gt;alert(1)&lt;/script&gt;
        -   comment appears every time the page loads, and script runs
            in each visitor’s browser
-   DOM-based
    -   user visits malicious URL supplied by attacker, URL contains
        malicious script/payload
    -   page contains embedded JavaScript that performs some function
        using the page’s URL
    -   payload within the URL is executed because that function
        processed it
    -   server’s responses never contained payload because it’s all
        client-side (executed by the embedded JS)

How to find it
--------------

### Testing a running application

-   Find spots where user input appears on page/within page source
    -   Payloads might have to be modified to fit the context of the
        input location
        -   example: if input inserted within existing HTML tag or event
            handler
        -   Add “&gt; at the beginning to close existing tags, for
            example

-   Test with various inputs, see what shows up (test what’s filtered
    and what isn’t)
    -   Script filter evasions
        -   &lt;script&gt;alert(1)&lt;/script&gt;
        -   &lt;scRipt&gt;alert(1)&lt;/scRipt&gt;
            -   Change case to evade filter searching for ‘script’
        -   &lt;scr&lt;script&gt;ipt&gt;alert(1)&lt;/scr&lt;/script&gt;ipt&gt;
            -   Evade filters that don’t search recursively
        -   %3Cscript%3Ealert%281%29%3C%2Fscript%3E
            -   URL-encoded
            -   some applications will decode the input after the filter
                processes it and passes it on
            -   can also double-encode the payload by URL-encoding the %
                signs after the first round of URL encoding
        -   &lt;object data=”data:text/html;base64,
            PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==”&gt;
            -   base64 encoded payload
    -   Add malicious event handler
        -   onfocus=alert(1)
        -   onerror=alert(1)
        -   onbeforeactivate=alert(1)
        -   onreadystatechange=alert(1)
        -   more available at
            <http://www.w3schools.com/tags/ref_eventattributes.asp>
    -   Use decimal or hexadecimal format
        -   &amp;\#97;
            -   ‘a’ in decimal format
            -   &amp;\#97;lert(1)
            -   <http://www.ascii.cl/htmlcodes.htm>
        -   &amp;\#x61;
            -   ‘a’ in hexadecimal format
            -   &amp;\#x61;lert(1)
        -   can add leading zeros and/or remove semicolon
            -   &amp;\#00097
            -   &amp;\#x00061
    -   Unicode escape
        -   \\u0061
            -   ‘a’ in Unicode
            -   \\u0061lert(1)
            -   <http://unicode-table.com/en/>
    -   Try inserting null byte before payload
        -   %00
        -   may evade signature-based filters
    -   Can combine encoding methods
        -   e.g. URL-encode the \\ in \\u0061
    -   Other methods of spawning alert box
        -   &lt;img src=x onerror=alert(1)&gt;
        -   &lt;object data=javascript:alert(1)&gt;
        -   &lt;script&gt;eval(String.fromCharCode(97,108,101,114,116,40,49,41))&lt;/script&gt;
        -   Use javascript packer/minifier
-   If your payload executes, or would execute without browser XSS
    filter, the site is vulnerable to XSS

### Code review

-   user input strings are directly inserted into code
    -   pageTitle = request.getParameter(“title”);
    -   &lt;? php print "Not found: " .
        urldecode(\$\_SERVER\["REQUEST\_URI"\]); ?&gt;

How to exploit it
-----------------

-   Send user session cookie to attacker’s website
    -   e.g. make a request for www.hacker.site/cookie123
    -   Attacker can see which pages were visited (regardless of whether
        they exist or not) and grab session info from there
-   alter information that would normally be on the page
-   use exploit kit/browser exploit framework

How to fix it
-------------

-   validate input (server-side)
    -   limit input length
    -   only allow a certain subset of expected characters (e.g. only
        allow numbers for age value)
    -   regex matching
    -   (be sure to test the impact of null bytes on your input filter)
-   validate output
    -   HTML-encode problem characters
        -   &lt; encoded to &amp;lt;
        -   &gt; encoded to &amp;gt;
        -   ‘ encoded to &amp;apos;
        -   “ encoded to &amp;quot;
        -   & encoded to &amp;amp;
    -   Use backslashes to escape problem characters when inserting user
        input into JavaScript
        -   quotation marks
        -   backslashes
    -   using a security encoding library makes all of this easier
-   eliminate dangerous input points
    -   within existing script tags
    -   within existing event handlers
    -   both are very difficult to secure and have a high risk of filter
        evasion

SQLi
====

What is it
----------

-   ability of an attacker to escape an input location in a SQL query
    string and finish the string with his/her own SQL that will be
    executed on the backend DBMS

How to find it
--------------

### Testing a running application

-   add escape characters (‘ “ \` etc.) or comments (\# \-\-) on the end
    of your normal input and see how the application handles it
    -   generic “login failed” messages
        -   might be blind injection (non-verbose errors) -&gt; keep
            trying
        -   try time delay-based injection and see if it’s successful
    -   or might not be injectable
    -   error/anomaly/something’s not right
        -   probably injectable, try writing a payload
-   probe for the structure of the query
    -   fingerprint the DBMS if necessary
    -   is it a SELECT, INSERT, UPDATE, or DELETE statement?
        -   infer based on the functionality of the application
            -   login function? probably SELECT
            -   register user function? probably INSERT
    -   where is user input located within the query?
        -   usually within WHERE clause of a SELECT statement
        -   infer based on functionality of the application
            -   does the user input change order of the results?
                probably ORDER BY
    -   if SELECT, how many columns are being selected?
        -   use UNION SELECT and add columns one by one until the query
            executes successfully
            -   UNION select 1; \#
            -   UNION select 1, 1; \#
            -   UNION select 1, 1, 1; \#
            -   and so on..
            -   selecting 1 will work for both string columns and
                numerical columns because the database will interpret
                the context
        -   use ORDER BY and increase the column number until you reach
            an error
            -   ORDER BY 1
            -   ORDER BY 2
            -   and so on..
            -   when the number is greater than the amount of columns,
                it will trigger an error
-   create a test payload and modify it to fit the existing syntax of
    the query
    -   try payload without escape characters
        -   input might not be quoted
        -   example: test or 1=1; \#
    -   try to fit payload into existing SQL without attempting to
        finish the query yourself
        -   example if single quote is being used:
            -   test’ or ‘1’=’1
    -   keep in mind the location of the input within the SQL query
        -   some payloads might not be possible due to where they’re
            being inserted
        -   example: when injecting in an ORDER BY clause, the database
            won’t accept UNION, WHERE, AND, or OR at this point
-   sqlmap
    -   good way to check when you can’t find anything by hand
    -   good at automating when things get tricky
        -   e.g. exfiltrating 1 char at a time using ASCII char codes
    -   won't find everything, however

### Code review

-   SQL query strings are concatenated with unfiltered user input
    -   String query = "SELECT \* FROM accounts WHERE custID='" +
        request.getParameter("id") + "'";

How to exploit it
-----------------

-   read critical data from database
    -   list of database users (if db account used within app
        has permission)
    -   list of web app users/passwords (usually a table in
        the database)
    -   extract crucial web app data
-   malicious actions on database
    -   modify, add, or remove data
    -   shutdown DBMS
    -   attempt to priv esc/get shell on database server

How to fix it
-------------

-   parameterized queries/prepared statements
    -   using a function that safely handles user input to generate
        query, passing the input in as a parameter
    -   parameterized query is a two-step process:
        -   specify the query structure (leave placeholders for
            user input)
        -   fill in the placeholders with user input
    -   user input will always be handled as data and will no longer be
        able to change the structure of the query
-   defense-in-depth
    -   use DB account with as few permissions as possible
    -   remove or disable unnecessary DB functions
        -   such as xp-cmdshell in MSSQL

CSRF
====

What is it
----------

-   attacker can cause the user to submit unwarranted requests and
    subsequently perform actions on a web application without their
    knowledge
-   attacker can submit requests on user’s behalf, but can’t see
    responses due to same-origin policy

How to find it
--------------

-   look for critical application function to target (e.g. reset
    password, create new user)
-   determine if the function relies solely on cookies to track sessions
-   determine if all request parameters are known/predictable
    -   will not work if there’s a CSRF token or other necessary
        parameter whose value can’t be predicted
-   if yes to both of the above, it’s most likely CSRF vulnerable

How to exploit it
-----------------

-   launch request as soon as attacker’s page loads
    -   if application function uses GET requests, attacker creates img
        tag with src = the malicious request
    -   if application function uses POST requests, attacker creates
        form, puts parameters in hidden fields, and submits it as soon
        as the page loads
-   end goal: submit malicious requests that perform critical actions,
    such as:
    -   transfer money (banking app)
    -   change password
    -   grant permissions

How to fix it
-------------

-   anti-CSRF token
    -   submitted as a hidden parameter in forms
    -   server expects a certain token, checks token of form submission
        to see if it matches
    -   if it doesn’t match, the server doesn’t process the submission
    -   token needs to be unique and non-predictable

UI Redress
==========

What is it
----------

-   attacker loads target application in an iframe and layers a
    misleading UI over it
-   victim clicks on attacker’s UI, when in reality they are interacting
    with the target app beneath
    -   can maliciously interact with target app by:
        -   initiating two-step process by CSRF, then using UI redress
            to complete the second step that’s protected by an anti-CSRF
            token
-   this kind of attack evades anti-CSRF tokens, because the token is
    submitted when the user (unknowingly) submits a form
    -   in the iframe, the application is running “normally”, so the
        anti-CSRF token is received and sent without issues
    -   from the server’s view, it appears as if the user submitted the
        form on their own accord, so there is no reason for suspicion

Framebusting
------------

-   common defense, but can be easily circumvented
-   attempts to check if application is being loaded within an iframe,
    and if it is, tries to ‘bust’ out of the frame by:
    -   reloading itself into the topmost frame on the page
    -   refusing to load
    -   loading error page
    -   etc.
-   there are various ways to work around framebusting checks

How to fix it
-------------

-   framebusting is generally not a reliable defense
-   use X-Frame-Options header in HTTP response
    -   two possible values:
        -   deny
            -   browser will prevent page from being framed
        -   sameorigin
            -   browser will prevent page from being framed by
                third-party domains

Insecure access controls
========================

What is it
----------

-   critical app functions do not verify that the issuer of the request
    has permission to carry out that action
    -   e.g. regular user account can access admin function by browsing
        to the exact URL of the function
-   access control categories:
    -   vertical
        -   allows different types of users to access different types of
            functionality
            -   example: admin can view profiles, create profiles,
                remove profiles
            -   regular user can only view profiles
        -   when vertical access controls are broken:
            -   users can perform functions that they don’t have
                permission to
                -   example for the above scenario: a regular user
                    creating profiles
    -   horizontal
        -   defines the breadth/scope of resources a user can apply a
            function to
            -   example: user has the permission to view email (a
                vertical access control), but can only view their own
                email and not anyone else’s (horizontal access control)
        -   when horizontal access controls are broken:
            -   users can apply functions to a wider extent of resources
                than they’re normally allowed
                -   example: user can view their own email, and anyone
                    else’s email in the company
    -   context-dependent
        -   restricts user access based on the current application state
            -   example: prevents user from accessing steps out of order
                in a multi-step process
        -   when context-dependent access controls are broken:
            -   user can exploit flaw in the application logic to
                perform unauthorized or unintended functionality
                -   example: user skips the payment step when placing an
                    order

How to find it
--------------

-   browse the site through a proxy application (Burp, ZAP, etc.) to
    create a site map
-   use accounts with varying privilege levels to map out the entirety
    of the application’s functions
    -   unregistered, regular user, admin, etc.
-   once functions have been enumerated, try repeating the same actions
    with a lesser-privileged user
    -   see if the functionality performs the same way
    -   the proxy used to create the site map will most likely have
        functionality to assist with this
-   same idea for multi-step processes, except they require a bit more
    attention
    -   test each request individually to test each step’s access
        controls
    -   goal is to find any steps in the process that assume you must
        have gotten there legitimately and don’t enforce or enforce weak
        access controls
    -   see if the application uses the Referrer header as an access
        control
        -   if so, this can be changed by the user (meaning it’s a bad
            access control)
-   look for and change access control parameters, and try adding your
    own if they don’t exist
    -   such as admin=true
-   try changing resource parameters and see if you can access any
    unintended resources
    -   such as documentID=82736
        -   try changing to 1, see if IDs are assigned sequentially, etc

How to exploit it
-----------------

-   carry out administrative actions
    -   change passwords, grant permissions, etc.
-   access unintended information
    -   another user’s documents or email
-   modify or remove information
    -   delete someone’s calendar
    -   change your salary
-   privilege escalation
    -   within the application (e.g. user -&gt; admin)
    -   then can attempt to escalate into the OS

How to fix it
-------------

-   essentially, don’t trust the user
    -   don’t assume functionality is secure because the user will never
        be able to find it
        -   e.g. long URLs, unique document IDs, etc.
        -   still need effective access controls on these
    -   don’t trust any client-side access controls or access controls
        that the user has the power to change
        -   such as admin=true parameters
    -   don’t assume users will complete multi-step processes in the
        correct order
-   make access control decisions based on the user’s session
-   use a function/interface that can be used throughout the application
    to enforce access controls
    -   this way, everything is uniform and can be updated quickly
        throughout the entire application
-   defense-in-depth
    -   switch between different-privileged DBMS accounts depending on
        the application action being performed
        -   low-privileged action uses low-privileged account
    -   access to individual DBMS tables can be limited to certain DBMS
        accounts as well

Command injection
=================

What is it
----------

-   escaping a parameter in a command that runs on the OS and writing
    your own command that will be executed

How to find it
--------------

-   find a page where user input is being included in an OS command
    -   e.g. function that pings an IP and displays output
-   attempt to escape the current command and execute your own command,
    observe results
    -   ; ls
    -   \| ls
    -   \|\| ls
    -   & ls
    -   && ls
    -   \` ls \`
    -   try time delays if the command output is blind/non-verbose

How to exploit it
-----------------

-   cat /etc/password
-   read other OS data
-   remove files
-   PHP shell
-   ...anything the app’s user account (typically www-data) has the
    power do to

How to fix it
-------------

-   exposing OS commands to user input should be avoided whenever
    possible
-   use whitelist if possible
-   restrict character set of user input depending on expected input
    -   e.g. numbers only
-   use command APIs

Directory traversal
===================

What is it
----------

-   application interacts with filesystem using unvalidated user input
    -   e.g. user specifies file name for a photo a photo gallery app
-   attacker submits malicious input and can browse to directories of
    his choosing and access the files within

How to find it
--------------

### Testing a running application

-   find a dynamic page that interacts with files based on user input
    -   try adding ../ or ..\\ to navigate to the parent directory
    -   can add many ../ to go all the way up to the root (excess ../
        won’t cause problems because the root is the highest you can go,
        trying to go farther just returns root again)
        -   if the app has the functionality to view files, try viewing
            an expected system file such as /etc/passwd or
            /windows/win.ini
    -   if this works, the application is vulnerable
-   avoiding filters
    -   try /etc/default/../passwd instead of /etc/passwd
        -   if the results are different, there might be a filter
            modifying the input
        -   if identical, there probably isn’t a filter
    -   try different encoding schemes on the path payload
        -   URL encoding
        -   Double URL encoding
        -   Unicode encoding
    -   put one traversal sequence within another
        -   ….//
        -   similar to &lt;scr&lt;script&gt;ipt&gt;
    -   if filter is checking file endings, put a bogus ending
        -   /etc/passwd%00.jpg
            -   null byte may terminate the string depending on the
                execution environment, but the filter still sees the
                .jpg and validates the input

### Code review

-   user input passed directly to filesystem API without validating
    input or verifying file has been selected

How to exploit it
-----------------

(ability to read or write depends on the application function)

-   reading critical OS files
    -   /etc/passwd
    -   other OS info useful for penetrating system
-   reading critical business data on filesystem
    -   intellectual property, patient records, etc.
-   overwriting files
    -   overwrite data files with your own data
    -   overwrite config files if possible

How to fix it
-------------

-   like OS commands, user input should not be used to interact with the
    filesystem whenever possible
-   after processing the file path (decoding and canonicalizing), check
    for ../ ..\\ or null bytes
    -   if any are found, stop processing the request
    -   do not attempt to sanitize, because the request is malicious (is
        not legitimate and does not need to be processed)
-   check file type of requested file and compare it against a list of
    acceptable types
