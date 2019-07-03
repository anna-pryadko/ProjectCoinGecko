farr = [];
arrIdCoins = [];
arrCoins = [];
arrInfoCoin = [];
arrMoreInfo = [];
availableCoins = [];
var reportsIntervalID;

function RunSpinner() {                               
	$('.line-chart').hide();  
	$('.printCoins').hide();
	$('.spinner').show();
}

function StopSpinner() {
	$('.line-chart').hide(); 
	$('.spinner').hide();
	$('.printCoins').show();
}

function RunSpinnerRep() {                               
	$('.line-chart').hide();  
	$('#chartContainer').hide();
	$('.spinner').show();
}

function StopSpinnerRep() {
	$('.line-chart').hide(); 
	$('.spinner').hide();
	$('#chartContainer').show();
}

GetAllCoins();
//localStorage.clear();

function goHome() {
$('#chartContainer').hide(); 
$('.printCoins').show(); 
clearInterval(reportsIntervalID);
window.location.reload();
}

function GetAllCoins() {
	var myUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1`;
	RunSpinner();
	$.ajax({
		type: 'GET',
		datatype: 'json',
		url: myUrl,
		async: false,    
		success: function (data) {  
			arrCoins = data;
			StopSpinner();
			print(arrCoins); 	
		},
		error: function (error) {
			console.log("error : ", error);
		}
	});     
}

function print(arrCoins) {
	arrCoins.length = 100;
	str = ""; 

	$(".printCoins").html('');

	var $printCoins = $('.printCoins');

	$.each(arrCoins, function(i,arr_prin) {   
		availableCoins.push(arr_prin.symbol);

		str = `<div class='card col-md-4 col-sm-12'>`;
		str += `<div class='card-body'>`;
		str += `<label class='switch'>`;
		str += `<input type='checkbox' id="${arr_prin.symbol}" class='togBtn'>`;
		str += `<span class='slider round'></span>`;
		str += `</label>`;
		str += `<h5 class='card-title'>${arr_prin.name}</h5>`;
		str += `<p class='card-text'>${arr_prin.symbol}</p>`;
		str += `<button type="button" class='btn btn-primary b' myAtr="${arr_prin.id}">More Info</button>`;
		str += `<div class='moreInfo'"></div>`;
		str += `</div>`;

		$printCoins.append(str);
	});
	
	$(".moreInfo").toggle();

	setChooseCoins();
}

function setChooseCoins() {
	if (localStorage.ChooseCoinsArr) {
		ChooseCoinsArr = JSON.parse(localStorage.ChooseCoinsArr);
		
		console.log(ChooseCoinsArr);
		
		for (let idCoin of ChooseCoinsArr) {   
			$('#' + idCoin).prop('checked',true);
		}
	}
}    

$('.b').on('click', function() {
	var idCoin = $(this).attr('myAtr');
	var div = $(this).next(".moreInfo");
	
	var checkCoin=checkInfoCoin(idCoin);

	if (checkCoin === true) {
		console.log(5)
		
	} else {
		getInfoCoin(idCoin);
		printInfoCoin(idCoin, div);
	}
	
	div.slideToggle(200);
})

function getInfoCoin(idCoin) {
	var myUrl = `https://api.coingecko.com/api/v3/coins/${idCoin}`;
    RunSpinner();
    $.ajax({
		type: 'GET',
		datatype: 'json',
		url: myUrl,
		async: false,    
		success: function (data) {
			arrInfoCoin = data;
			StopSpinner();
		},
		error: function (error) {
			console.log("error : ", error);
		}
    })
}

function printInfoCoin(idCoin, divToInsert) { 
	priceEur = arrInfoCoin.market_data.current_price.eur;
	priceIls = arrInfoCoin.market_data.current_price.ils;
	priceUsd = arrInfoCoin.market_data.current_price.usd;

	strInfo = "";

	divToInsert.html(''); 

	strInfo = `<img src="${arrInfoCoin.image.small}">`;
	strInfo += "<p>Currencies rates: </p>";
	strInfo += "<div>" + priceEur.toFixed(3) + "&euro;</div>";
	strInfo += "<div>" + priceIls.toFixed(3) + "&#8362;</div>";
	strInfo += "<div>" + priceUsd.toFixed(3) + "&#36;</div>";

	divToInsert.append(strInfo);

	saveInfoCoin(idCoin);
}

function saveInfoCoin(idCoin) {   
    if (localStorage.arrMoreInfo) {
        arrMoreInfo = JSON.parse(localStorage.arrMoreInfo); 
        InfoCoinOld = (arrMoreInfo.find(x => x.idCoin === idCoin));
        
        if (typeof InfoCoinOld === "undefined") {
			InfoCoin = {};
			
			InfoCoin.idCoin = idCoin;
			InfoCoin.picture = arrInfoCoin.image.small;
			InfoCoin.eur = arrInfoCoin.market_data.current_price.eur;
			InfoCoin.ils = arrInfoCoin.market_data.current_price.ils;
			InfoCoin.usd = arrInfoCoin.market_data.current_price.usd;
			InfoCoin.time = new Date();
			
			arrMoreInfo.push(InfoCoin);
			
			localStorage.arrMoreInfo = '';
			localStorage.arrMoreInfo = JSON.stringify(arrMoreInfo);
		}
    } else {
		InfoCoin = {};
		
		InfoCoin.idCoin = idCoin;
		InfoCoin.picture = arrInfoCoin.image.small;
		InfoCoin.eur = arrInfoCoin.market_data.current_price.eur;
		InfoCoin.ils = arrInfoCoin.market_data.current_price.ils;
		InfoCoin.usd = arrInfoCoin.market_data.current_price.usd;
		InfoCoin.time = new Date();
		
		arrMoreInfo.push(InfoCoin);
		
		localStorage.arrMoreInfo = '';
		localStorage.arrMoreInfo = JSON.stringify(arrMoreInfo);
    }
}

function checkInfoCoin(idCoin) {
    
    if (localStorage.arrMoreInfo) {
        arrMoreInfo = JSON.parse(localStorage.arrMoreInfo);  
        if (InfoCoinOld = (arrMoreInfo.find(x => x.idCoin === idCoin))) {
            
            var dateNow = new Date();
            
            dateOld = Date.parse(InfoCoinOld.time);
            
            diffTime = (dateNow-dateOld)/60000;
            
            if (diffTime < 2) {
                
				return true; 
				   
            } else {
				arrMoreInfo.splice(arrMoreInfo.indexOf(idCoin), 1);
				localStorage.arrMoreInfo = '';
				localStorage.arrMoreInfo = JSON.stringify(arrMoreInfo);	
					   
            }
        }
    }
}

var switchStatus = false;
var coinForModal = "";

$(".togBtn").on('change', function() {
	if (localStorage.ChooseCoinsArr) {
		ChooseCoinsArr = JSON.parse(localStorage.ChooseCoinsArr)
	} else {
		ChooseCoinsArr = [];
	}

	if ($(this).is(':checked')) {
		if (ChooseCoinsArr.length == 5) {
			$("#"+this.id).prop("checked",false);
			
			coinForModal = this.id;
			
			ShowModalWindow();
		} else if (ChooseCoinsArr.length < 5 && ChooseCoinsArr.includes(this.id) == false) {
			// switchStatus = $(this).is(':checked');
		
			ChooseCoinsArr.push(this.id);
		
			// console.log(switchStatus); // To verify
		
			console.log("checked", ChooseCoinsArr);
		
			// localStorage.ChooseCoinsArr = '';
			localStorage.ChooseCoinsArr = JSON.stringify(ChooseCoinsArr);
		}
	} else {
		switchStatus = $(this).is(':checked');
		
		ChooseCoinsArr.splice(ChooseCoinsArr.indexOf(this.id), 1);
		
		console.log(switchStatus); // To verify
		
		console.log("not checked", ChooseCoinsArr);
		
		// localStorage.ChooseCoinsArr = '';
		localStorage.ChooseCoinsArr = JSON.stringify(ChooseCoinsArr);
	}
});

var removeCoinsArr = [];

function ShowModalWindow() {
	strMod = "";
    
    $("#modalPrint").html('');
    
    var $modalPrint = $('#modalPrint');
    
    $.each(ChooseCoinsArr,function(i,arr_prin) {
		strMod = `<div class='row'>`;  
		strMod += `<div class='col-8'>`;   
		strMod += `<p>${arr_prin}</p>`;
		strMod += `</div>`;
		strMod += `<div class='col-4'>`;  
		strMod += `<label class='switch'>`;
		strMod += `<input type='checkbox' id='${arr_prin}' class='togBtnModal' checked/>`;
		strMod += `<span class='slider round'></span>`;
		strMod += `</label>`;
		strMod += `</div>`;
		strMod += `</div>`;
		
		$modalPrint.append(strMod);
	});
	         
    $('#myModalBox').modal('show');
    
    $(".togBtnModal").on('change', function() {
		if ($(this).is(':checked')) {	
			switchStatus = $(this).is(':checked');
	
			removeCoinsArr.splice(removeCoinsArr.indexOf(this.id), 1);
	
			console.log(removeCoinsArr);
	
			console.log("not checked remove",switchStatus); // To verify
		} else {
			// switchStatus = $(this).is(':checked');
	
			removeCoinsArr.push(this.id);
	
			// console.log(switchStatus); // To verify
	
			console.log("checked remove",removeCoinsArr);
		}
	});
}

function modalSave() {
	for (let coin of removeCoinsArr) {
		ChooseCoinsArr.splice(ChooseCoinsArr.indexOf(coin), 1);
		$("#"+coin).prop("checked", false);
	}
	
	ChooseCoinsArr.push(coinForModal);
	
	localStorage.ChooseCoinsArr = JSON.stringify(ChooseCoinsArr);
	
	$("#"+coinForModal).prop("checked", true);
	
	console.log("modal save", ChooseCoinsArr);
	
	$('#myModalBox').modal('hide');
}

function goAbout() {
	clearInterval(reportsIntervalID);
	$('#chartContainer').hide(); 
	$('.printCoins').show(); 

	str = "";

	$(".printCoins").html('');

	var $printCoins = $('.printCoins');
	str="<div class='col-md-4 col-sm-12'>"
	str += "<div class='card cardAbout' style='width: 18rem;'>";
	str += "<img class='card-img-top' src='foto.jpg' alt='Card image cap'>";
	//str += "<div class='card-body'>";
	//str += "<h5 class='card-title'>Here I am</h5>";
	//str += "<p class='card-text'>22222</p>";
//	str += "</div>";
	str += "</div>";
	str += "</div>";
	str += "<div class='col-md-8 col-sm-12'>";
	str +="<p class='about'>My name is Anna. I am a student at John Bryce College, Full Stack Developer course.</p>";
	str +="<p class='about'>This is my study jQuery-AJAX API Project.</p>";
	str +="<p class='about'>On this site you can watch crypto currencies rates. </p>";
	str += "</div>";

	$printCoins.append(str);
}

$('#searchCoinField').autocomplete({ source: availableCoins });

function searchCoin() {
	console.log(1234);
	var idCoinSearch = searchCoinField.value;
	if (idCoinSearch=="") {
		alert("You should type something!")
	} else if (availableCoins.includes(idCoinSearch)==false) {
		       alert("Did not find ")
			}

	    else  {
		var idCoin = (arrCoins.find(x => x.symbol == idCoinSearch)).id
		
		var checkCoinSerch=checkInfoCoin(idCoin);
		
		if (checkCoinSerch === true) {
			priceEur = InfoCoinOld.eur;
			priceIls = InfoCoinOld.ils;
			priceUsd = InfoCoinOld.usd
		
			strModInfo = "";
			strModInfo ="<div class='col-md-3 offset-1'>";
			strModInfo +="<div  class='picCoinSearch'>";
			strModInfo += `<img src="${InfoCoinOld.picture}">`;
			strModInfo +="</div>";
			strModInfo +="</div>";
			strModInfo +="<div class='col-md-8'>"
			strModInfo += "<h3>Currencies rates: </h3>";
			strModInfo += "<div>" + priceEur.toFixed(3) + "&euro;</div>";
			strModInfo += "<div>" + priceIls.toFixed(3) + "&#8362;</div>";
			strModInfo += "<div>" + priceUsd.toFixed(3) + "&#36;</div>"; 
			strModInfo +="</div>";
			
		} else {
			getInfoCoin(idCoin);
		
			priceEur = arrInfoCoin.market_data.current_price.eur;
			priceIls = arrInfoCoin.market_data.current_price.ils;
			priceUsd = arrInfoCoin.market_data.current_price.usd;
		
			strModInfo = "";
			strModInfo ="<div class='col-md-3 offset-1'>"
			strModInfo +="<div  class='picCoinSearch'>";
			strModInfo += `<img src="${arrInfoCoin.image.small}">`;
			strModInfo +="</div>";
			strModInfo +="</div>";
			strModInfo +="<div class='col-md-8'>"
			strModInfo += "<h3>Current courses: </h3>";
			strModInfo += "<div>" + priceEur.toFixed(3) + "&euro;</div>";
			strModInfo += "<div>" + priceIls.toFixed(3) + "&#8362;</div>";
			strModInfo += "<div>" + priceUsd.toFixed(3) + "&#36;</div>";
			strModInfo +="</div>";
			
			saveInfoCoin(idCoin);    
		}

		ShowModalWindowInfo(strModInfo);
	} 
} 

function ShowModalWindowInfo(strModInfo) {
	
	$("#modalPrintInfo").html('');

	var $modalPrintInfo = $('#modalPrintInfo');

	$modalPrintInfo.append(strModInfo);
	
	$('#myModalBoxInfo').modal('show');
}

function goReports() {
	let coins = JSON.parse(localStorage.ChooseCoinsArr);

	if (coins.length==0){
		alert ("You must choose at least 1 coin")
	}
	else {
            $('.printCoins').hide();
            $('#chartContainer').show(); 
			
			let options = {
				interactivityEnabled: true,
				animationEnabled: true,
				axisX: {
					valueFormatString: "HH:mm:ss",
					titleFontFamily: "-apple-system, sans-serif",
					labelFontFamily: "-apple-system, sans-serif"
				},
				toolTip: {
					shared: true
				},
				legend: {
					cursor: "pointer",
					verticalAlign: "bottom",
					fontFamily: "-apple-system, sans-serif",
					itemclick: toggleCoinAppearance
				},
				data: []
			};
			
			let chart = new CanvasJS.Chart("chartContainer", options);

			function toggleCoinAppearance(e) {
				if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					e.dataSeries.visible = false;
				} else {
					e.dataSeries.visible = true;
				}
				e.chart.render();
			}
			
			console.log("coins", coins)
			
			function setupReports() {
				options.title = {
									text: `${coins.join(", ").toUpperCase()} to USD`,
								 	fontFamily: "-apple-system, sans-serif"
								 };
			
				$.each(coins, function(index, coin) {
					const num = index + 1;
					
					if (num == 1) {
						options[`axisY`] = {
												title: "Coin Value",
												titleFontFamily: "-apple-system, sans-serif",
												labelFontFamily: "-apple-system, sans-serif",
												valueFormatString: "#,###.###$",
												includeZero: false
											}
					} else {
						options[`axisY${num}`] = {
												  	titleFontFamily: "-apple-system, sans-serif",
													labelFontFamily: "-apple-system, sans-serif",
													valueFormatString: "#,###.###$",
													includeZero: false
												  }
					}
					
					options.data.push({
										type: "spline",
										name: coin.toUpperCase(),
										titleFontFamily: "-apple-system, sans-serif",
										labelFontFamily: "-apple-system, sans-serif",
										xValueFormatString: "HH:mm:ss",
										yValueFormatString: "#,###.###$",
										showInLegend: true,
										dataPoints: []
									});
				})
				
				reportsIntervalID = setInterval(updateReport, 2000);
			}
			
			setupReports()
			
			async function updateReport() {
				const currentPrices = await getReports(coins);
				
				$.each(options.data, function(index, currentCoinData) {
					const num = index + 1;
					const coinName = coins[index].toUpperCase();
					
					let y = currentPrices[coinName]["USD"];
					let x = new Date();
					currentCoinData.dataPoints.push({x: x, y: y})
				})
				
				console.log(options);
				
				chart.render();
			}

			async function getReports(coins) {
				const compareBaseURL = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=;;;Coin;;;&tsyms=USD`;
				const endpoint = compareBaseURL.replace(";;;Coin;;;",coins.join(",").toUpperCase());
	
				console.log(endpoint);
				let currentCoinPrice;
				RunSpinnerRep();
				$.ajax({
					type: 'GET',
					datatype: 'json',
					url: endpoint,
					
					async: false,
					success: (data) => {            
						console.log("report call response: ", data);
						currentCoinPrice = data;
						StopSpinnerRep();
					},
					error: (error) => {
						printError(`Request Error - ${error.status}`);
						console.log("report call error: ", error);
					}
				});
	
				return currentCoinPrice;
			}
		}
}	