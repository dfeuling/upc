/*
UPS.js
	Node v18.16.1
	Accepts a string argument from the command line as the first (and only) argument to the script, which should be a valid 12-value UPC code
	Evaluates that UPC code, and if one is not provided, then the default value is used
	White space in codes will be ignored
	UPCs containg values outside of numerical literals will give an invalid result

	Example:
		Add together the value of all of the digits in odd positions (digits 1, 3, 5, 7, 9 and 11).  [6 + 9 + 8 + 0 + 0 + 9 = 32];
	    Multiply that number by 3.  [32 * 3 = 96];
	    Add together the value of all of the digits in even positions (digits 2, 4, 6, 8 and 10).  [3 + 3 + 2 + 0 + 3 = 11];
	    Add this sum to the value in step 2.  [96 + 11 = 107];
	    Take the number in Step 4. To create the check digit, determine the number that, when added to the number in step 4, is a multiple of 10.  [107 + 3 = 110];
	    The check digit is therefore 3.
*/

const STATIC_UPC_VALUE = "6 3938200039 3";

upcChecker(process.argv[2]);

/*
upcChecker function
Inputs: Single UPC value, type String
Outputs: Boolean
Purpose: Determine if a given UPC is valid or not
*/
function upcChecker(input)
{
	//Remove any blank spaces
	let formattedInput = format(input);

	//Make sure we have valid input before doing any kind of operations
	if(errorCheck(formattedInput))
	{
		const checkDigit = parseInt(formattedInput.toString().slice(formattedInput.toString().length - 1));
		if(checkDigit == calculateCheckDigit(formattedInput))
			return true
		else
			return false
	}
	else
		return false;
	

	//format function
	//Inputs: String representing the user entered UPC value
	//Outputs: Integer
	//Purpose: Convert input to an integer
	function format(rawUPC)
	{
		// If a candidate UPC isn't provided, use the default
		if(rawUPC)
			return parseInt(rawUPC.replaceAll(" ", ""));
		else
			return parseInt(STATIC_UPC_VALUE.replaceAll(" ", ""));
	}

	//errorCheck function
	//Inputs: Integer representing the UPC value
	//Outputs: Boolean
	//Purpose: Check for validity of input
	function errorCheck(formattedUPC)
	{
		// In the case of NaN or not enough numerical values, it isn't a valid UPC
		if(formattedUPC.toString().length === 12)
			return true
		else
			return false;
	}

	//calculateCheckDigit function
	//Inputs: Integer representing the UPC value
	//Outputs: Integer representing the final UPC numeric literal: the check digit
	//Purpose: Using the rules at the header of the UPC.js file, calculate the check digit
	function calculateCheckDigit(formattedUPC)
	{
		let upc = formattedUPC.toString().slice(0, formattedUPC.toString().length - 1);
		let runningTotal = new Number(0);
		let evenTotal = 0;
		let calculatedCheckDigit = 0;

		//Add together the value of all of the digits in odd positions for multiplication
		//Also store even positions for later use
		for (const [index, value] of Object.entries(upc)) { 
		  if((parseInt(index) + 1) % 2 == 0)
		  	evenTotal += parseInt(value)
		  else
		  	runningTotal += parseInt(value)
		  
		}

		//Multiply the running total by 3
		runningTotal *= 3

		//Combine the even total into the running total
		runningTotal += evenTotal

		//Determine the check digit by incrementing until addition with the running total yields a multiple of 10
		while((runningTotal + calculatedCheckDigit) % 10 !== 0)
		{
			calculatedCheckDigit++;
		}

		return calculatedCheckDigit;
	}


}

