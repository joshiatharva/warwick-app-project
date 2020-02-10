const mongoose = require("mongoose");

/*  3 boxes of questions in Users:
*   box 1
*   box 2
*   box 3
*   
*   5 levels of difficulty -
*   1 - every session
*   2 - every 2 sessions
*   3 - every 3 sessions
*   4 - every 4 sessions
*   5 - retired
* 
*   Session 1: 0-2(Box 1)-5(Box 2)-9(Box 3)
*   Session 2: 1-3(Box 1)-6(Box 2)-0(Box 3)
*   Session 3: 2 
*/