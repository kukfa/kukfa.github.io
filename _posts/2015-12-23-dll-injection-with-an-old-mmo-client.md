---
layout: post
title: DLL Injection with an Old MMO Client
---

On and off over the past few months, I’ve been working on reversing the client of an old out-of-service MMO I used to play. This post goes over basic DLL injection, with the hope to update as I move into more advanced techniques and demonstrate a possible usage case.

To start off, we’re going to need a few tools. [Process Explorer](https://technet.microsoft.com/en-us/sysinternals/processexplorer.aspx) from the Sysinternals suite is used to inspect each running process and the DLLs it has loaded. I used [Visual Studio](https://msdn.microsoft.com/en-us/library/ms235636.aspx) to build the DLL and [NCLoader](https://isecpartners.github.io/tools/2014/10/29/ncloader.html) to inject it, although there are other tools that can be substituted if preferred.

Use your program of choice to write the DLL and build it. Here’s the code I used:

```c++
#include <windows.h>

BOOL APIENTRY DllMain(HINSTANCE hInst     /* Library instance handle. */,
	DWORD reason        /* Reason this function is being called. */,
	LPVOID reserved     /* Not used. */)
{
	switch (reason)
	{
	case DLL_PROCESS_ATTACH:
		MessageBox(0, (LPCWSTR) L"From DLL\n", (LPCWSTR) L"Process loading DLL", MB_ICONINFORMATION);
		break;

	case DLL_PROCESS_DETACH:
		MessageBox(0, (LPCWSTR) L"From DLL\n", (LPCWSTR) L"Process unloading DLL", MB_ICONINFORMATION);
		break;

	case DLL_THREAD_ATTACH:
		MessageBox(0, (LPCWSTR) L"From DLL\n", (LPCWSTR) L"Creating new thread", MB_ICONINFORMATION);
		break;

	case DLL_THREAD_DETACH:
		MessageBox(0, (LPCWSTR) L"From DLL\n", (LPCWSTR) L"Thread exiting", MB_ICONINFORMATION);
		break;
	}

	return TRUE;
}
```

The code defines the DLL entry point function, which executes when processes load and unload the DLL, and processes that have already loaded the DLL create and terminate threads. In our case, we just throw up a message box letting us know what happened (not the [best](http://stackoverflow.com/questions/10930353/injecting-c-dll/10981735#10981735) way of doing things, but for our test purposes, it works). For more information, [TutorialsPoint](http://www.tutorialspoint.com/dll/dll_writing.htm) and [MSDN](https://msdn.microsoft.com/en-us/library/windows/desktop/ms682583(v=vs.85).aspx) have great pages on the topic.

Once we have the DLL built, open the target program (the MMO, in my case) and find it in Process Explorer. We’ll need the process ID (PID) of the target for the DLL injector.

[![Finding the PID using Process Explorer](/resources/dllinjection/1.PNG)](/resources/dllinjection/1.PNG)

Next, open the DLL injector and inject the DLL into the process. Using NCLoader:

[![Injecting using NCLoader](/resources/dllinjection/2.PNG)](/resources/dllinjection/2.PNG)

Notice that we can see the DLL loaded in the target process (the [purple](https://www.microsoft.com/security/sir/strategy/default.aspx#!malwarecleaning_explorer) DLL in Process Explorer), and the DLL_PROCESS_ATTACH case triggered its message box when the process loaded the DLL.

The next step is to modify the DLL to include useful functionality for reversing the client. More to come soon!
