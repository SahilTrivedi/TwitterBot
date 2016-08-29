var TwitterPackage = require('twitter');
var express = require('express');

var app = express();

var secret = {
  consumer_key: 'your twitter consumer key',
  consumer_secret: 'your twitter consumer_secret key',
  access_token_key: 'your twitter access_token_key',
  access_token_secret: 'your twitter access_token_secret'
}
var Twitter = new TwitterPackage(secret);

var wolfram = require('wolfram-alpha').createClient("your_wolfram_alpha_key");

 Twitter.stream('statuses/filter', {track: '#your_name'}, function(stream) {

   // ... when we get tweet data...
   stream.on('data', function(tweet) {

     // print out the text of the tweet that came in
     console.log("received tweet :::: " + tweet.text);

     var tipArr = tweet.text.split("#your_name");
     console.log("tweet text : " + tipArr[0]);
      //send question to wolfram using its api
     wolfram.query(tipArr[0], function (err, result) {
       if (err) throw err;
       console.log("Result: %j", result );
    //   console.log("final ::: "+ result[0].subpods[0].text);
       var ans  = "answer to, " + tipArr[0] + "is : ";
       var done = false;
       //looping for correct answer
       for(a of result){
         if(a.primary == true){
           done = true;
           ans += a.subpods[0].text
         }
       }
       if(done == false){

         ans = "You asked a Vague Question. ";
       }
       console.log("final answer : "+ans);

     //build our reply object
     var statusObj =  "Hi @" + tweet.user.screen_name + ", " + ans;

     //call the post function to tweet something
     Twitter.post('statuses/update', {status : statusObj} ,  function(error, tweetReply, response){

       //if we get an error print it out
       if(error){
         console.log(error);
       }

       //print the text of the tweet we sent out
       console.log(tweetReply.text);
     });
   });

   });

   // ... when we get an error...
   stream.on('error', function(error) {
     //print out the error
     console.log(error);
   });
 });


app.listen('5000',function(){
  console.log("started at 5000");
})
