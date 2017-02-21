//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );

//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );


//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
app.get( '/', function ( req, res ) {

    callLeboncoin(),

        res.render( 'pages/index' );


});

});






function callLeboncoin() {

    var url = 'https://www.leboncoin.fr/ventes_immobilieres/1058809794.htm?ca=12_s'

    request( url, function ( error, response, html ) {
        if ( !error && response.statusCode == 200 ) {

            const $ = cheerio.load( html )
            const lbcDataArray = $( 'section.properties span.value' )

            let lbcData = {
                price: parseInt( $( lbcDataArray.get( 0 ) ).text().replace( /\s/g, '' ), 10 ),
                city: $( lbcDataArray.get( 1 ) ).text().trim().toLowerCase().replace( /_!\s/g, '-' ),
                type: $( lbcDataArray.get( 2 ) ).text().trim().toLowerCase(),
                surface: parseInt( $( lbcDataArray.get( 4 ) ).text().replace( /\s/g, '' ), 10 )
            }

            console.log( lbcData )
        }
        else {
            console.log( error )
        }
    })
}

function parseMAData( html ) {

    const priceAppartRegex = /\bappartement\b : (\d+) €/mi
    const priceHouseRegex = /\bmaison\b : (\d+) €/mi

    if ( html ) {
        const priceAppart = priceAppartRegex.exec( html ) && priceAppartRegex.exec( html ).length === 2 ? priceAppartRegex.exec( html )[1] : 0
        const priceHouse = priceHouseRegex.exec( html ) && priceAppartRegex.exec( html ).length === 2 ? priceHouseRegex.exec( html )[1] : 0

        return {
            priceAppart: parseInt( priceAppart, 10 ),
            priceHouse: parseInt( priceHouse, 10 )
        }
    }

    return {}

}

function GetMeilleuragent( lbcData, routeResponse ) {
    if ( lbcData.city && lbcData.city && lbcData.surface && lbcData.price ) {
        const url = 'https://www.meilleursagents.com/prix-immobilier/{city}-{postalCode}/'.replace( '{city}', lbcData.city.replace( /\_/g, '-' ) ).replace( '{postalCode}', lbcData.postalCode );

        console.log( 'URL:', url )

        request( url, function ( error, response, html ) {

            if ( !error ) {

                let $ = cheerio.load( html );

                if ( Data.priceAppart && Data.priceHouse ) {
                    routeResponse.render( 'pages/index', {
                        data: {
                            lbcData,
                            maData,
                            deal,
                        }
                    })
                }

            }
        }
    }  ;


    //launch the server on the 3000 port
    app.listen( 3000, function () {
        console.log( 'App listening on port 3000!' );
    });
