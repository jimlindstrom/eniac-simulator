# ENIAC Simulator

This is a simulator for the [ENIAC](https://en.wikipedia.org/wiki/ENIAC), the first electronic general-purpose computer, built in 1946.

![Two women operating ENIAC](https://upload.wikimedia.org/wikipedia/commons/3/3b/Two_women_operating_ENIAC.gif)

## Getting Started

Visit a demo at [http://eniac-simulator.herokuapp.com/](http://eniac-simulator.herokuapp.com/).

Or, fire up the ENIAC locally by performing these operations:

*  Run ```foreman start```
*  Visit [http://localhost:5000/](http://localhost:5000/)

Once you set the controls, fire up the machine:

*  Press "INITIAL CLEAR" on the Initiating Unit (left-most unit)
*  Press "INIT PULSE" on the Initiating Unit
*  Press "START" on the Initiating Unit

## Details

I've focused on building enough to get a flavor for what it was like to program the ENIAC. What's included in this simulator so far is:

* Initiating Unit
* Cycling Unit
* Master Programmer
* Constant Transmitter (1)
* Accumulator (2)
* Buses

Not yet tackled are:

* Multiplier
* Function Table
* Divider and Square Rooter
* Printer
* Card Reader

(Refer to TODO.txt for a development roadmap.)

## How do I write an ENIAC program?

An ENIAC "program" consists of the wiring together of different units, and the units' settings (dials, knobs, etc). Let's say you wanted to write a program that simply lets the user enter two numbers, and then it would add them to produce a sum. Here's how you could wire up and configure the ENIAC do accompliash that:

1. Let the user load X into the top row of the Constant Transmitter
1. Let the user load Y into the bottom row of the Constant Transmitter
1. Set the initializer unit to kick off these operations (over control line 0) when the ENIAC is started:
    * Constant Transmitter sends top number (over digit tray 0)
    * Accumulator 0 receives number (over digit tray 0)
    * Kick off the next operations over control line 1
1. The next operations:
    * Constant Transmitter sends top number (over digit tray 0)
    * Accumulator 1 receives number (over digit tray 0)
    * Kick off the next operations over control line 2
1. The next operations:
    * Accumulator 0 transmits contents (over digit tray 1)
    * Accumulator 1 receives number, adding to its contents (over digit tray 1)

At the completion of this program, Accumulator 1 holds X+Y.

## References

*  [ENIAC Operating Manual](https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=ENIAC%20Operating%20Manual)
*  [Report on THE ENIAC](http://ftp.arl.mil/mike/comphist/46eniac-report/)

