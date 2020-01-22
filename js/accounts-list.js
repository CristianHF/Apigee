const accountsList = {
	"accountsList": [{
		"accountId": "acc-111",
		"alias": "MyAccount1",
		"mainBalance": {
			"amount": 25.32,
			"currency": "EUR"
		},
		"lastUpdateDate": "01/21/2020"
	},
	{
		"accountId": "acc-222",
		"alias": "MyAccount2",
		"mainBalance": {
			"amount": -15.07,
			"currency": "GBP"
		},
		"lastUpdateDate": "12/17/2019"
	},
	{
		"accountId": "acc-333",
		"alias": "MyAccount3",
		"mainBalance": {
			"amount": 264.69,
			"currency": "GBP"
		},
		"lastUpdateDate": "01/06/2020"
	},
	{
		"accountId": "acc-444",
		"alias": "MyAccount4",
		"mainBalance": {
			"amount": 99.09,
			"currency": "EUR"
		},
		"lastUpdateDate": "01/10/2020"
	},
	{
		"accountId": "acc-555",
		"alias": "MyAccount5",
		"mainBalance": {
			"amount": 58.77,
			"currency": "EUR"
		},
		"lastUpdateDate": "01/01/2020"
	}]
};

var authorization = context.getVariable("request.header.Authorization");

var responseCode = 0;
var responseOk;
var errorResponse;

if (authorization && authorization === "500") {
	responseCode = 500;
	errorResponse = {
		"errors": [{
			"code": "500",
			"message": "Internal Server Error",
			"level": "Error",
			"description": "Internal Server Error"
		}]
	};
}

if (responseCode === 0) {
	
	responseCode = 200;
	
	context.setVariable("response.content", JSON.stringify(accountsList));

} else {
	
	context.setVariable("response.content", JSON.stringify(errorResponse));
}

context.setVariable("response.status.code", responseCode);
context.setVariable("response.header.Content-Type", "application/json");
