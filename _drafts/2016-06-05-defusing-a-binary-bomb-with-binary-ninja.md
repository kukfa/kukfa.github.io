---
layout: post
title: Defusing a Binary Bomb with Binary Ninja
---

[Binary Ninja](https://binary.ninja/) is a new reverse engineering platform with a number of useful tools and features to make the reversing process quicker and easier. I did some experimenting with the beta version this weekend, and got acquainted with its Python API by working through Phase 1 of CMU's [Binary Bomb Lab](http://csapp.cs.cmu.edu/3e/labs.html). The lab has several 'phases' that are 'defused' by entering the correct input on stdin. If the program receives the wrong input, the bomb explodes and the program terminates. The bomb is defused once all phases have been solved.

This post goes over the steps I took to solve Phase 1 of the lab using the Binary Ninja API. The code is available on [GitHub](https://github.com/kukfa/binaryninja-test). For reference, here's how the phase looks in Binary Ninja's GUI:

[![Phase 1 in Binary Ninja GUI]({% link /resources/binaryninja/phase1.PNG %})]({% link /resources/binaryninja/phase1.PNG %})

Starting out, the binary is loaded and analyzed:
(The sleep function is due to Binary Ninja's threaded analysis, which currently does not have a way to alert when the analysis is completed)

```python
#!/usr/bin/python

import sys, time
sys.path.insert(0, 'binaryninja/python')
import binaryninja

bv = binaryninja.BinaryViewType["ELF"].open("bomb")
bv.update_analysis()
time.sleep(0.1)
```

Next, we iterate through the functions to find Phase 1:

```python
# find phase_1
for fn in bv.functions:
	if fn.symbol.name == "phase_1":
		phase_1 = fn
```

We then go to the main block in Phase 1. This phase calls a string comparison function that compares the input from stdin to a string stored in memory. We'll loop through each instruction to find the call to this function (the first and only call instruction in the block) and grab its address:

```python
# loop through instructions in phase_1's main block
for instr in phase_1.low_level_il.basic_blocks[0]:
	# get address of string comparison function
	if instr.operation == binaryninja.core.LLIL_CALL:
		callAddr = instr.address
```

Now that we have the address of the call, we can grab the parameters being passed to the function. The address of the comparison string is the second parameter being passed.

```python
# get address of comparison string
strAddr = phase_1.get_parameter_at(bv.arch, callAddr, None, 1).value
```

We now need to find the string length, so we know how far to read into memory to retrieve the comparison string. The string comparison function compares the strings byte-by-byte and does not use a string length parameter, so we'll find the string length in a similar fashion -- reading byte-by-byte until an ending character is reached:

```python
# get the length of comparison string
strLen = 0
curr = bv.read(strAddr, 1).encode('hex')
while (curr != "2e") and (curr != "00"):
	strLen += 1
	curr = bv.read(strAddr + strLen, 1).encode('hex')
```

Now that we have the location of the string in memory and know how far to read, we can use a simple call to read the comparison string:

```python
# get the comparison string
cmpStr = bv.read(strAddr, strLen)
print cmpStr
```

Running this program on the bomb lab linked above, the string "Border relations with Canada have never been better" will defuse Phase 1 and take us to the next phase.
