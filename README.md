# EtherGasPrice-Aggregator
# The Project
Provides valuable statistics regarding gas price to the user of the project.

## The Problem

Any operation on the Etheruem blockchain has a cost or a transaction fee known as gas fees. Gas fees is calculated as: Gas used by the transaction * Gas price. It's important to understand that when making interactions on the chain, it is best to be as cost-efficient as possible to reduce gas costs. Gas price is a variable unit that is determined by every block through the current network usage. Essentially, before a user chooses to interact with the chain, it's in its best interest to know how much the interaction/exchange would cost him/her. But how would the user know when to interact with the chain to have the least gas cost? In other words, how would the user know whether a certain transaction is cost-efficient? 

In order to solve this problem, we would need to not only look at the current gas price tiers (fast, average, low), but in order to truly understand whether the current gas cost is too high or too low, we would have to look at historical data to compare whether or not the current gas price is cost-efficient. 


For this project, I utilized publicly available gas price data from Etherscan to gain valuable insights on reducing costs of running on-chain operations. 

In a nutshell, the application uses external REST APIs to consume data from Etherscan and pushes that data to our own database that we can then access to read and give us insight.

# The Approach

## The Tech-stack, Tradeoffs, and Limitations

The project is implemented through the use of Nodejs, express, and MySQL. I felt that Nodejs and express worked well together especially for REST API development. I also found that MySQL integrates well with the former technologies as well the convenience for a local database as opposed to DynamoDB or other cloud databases. A relational database fit better as to what the project entailed and required.  MySQL also had the advantage of giving the developer a relational structure and in turn, allowed for more flexibility to query and access data in a number of different ways. The project also uses node-cron library for continuous calls to routes.

Because of time limitations and for simplicity, I chose to use the mentioned tech stack over cloud technologies such as API gateway, lambda, and dynamoDB. Because the project was completed with technologies on a local machine, there are definitely some tradeoffs. Notably, the application won't be robust and server-less like a cloud-based application integrated using AWS API gateway/lambda. However, an application with a local DB does allow for more flexibility for when building something simple. The application  also doesn't check for correct input parameter types. If it doesn't find the timestamps in the DB, it simply returns an error. However, if the input parameter is another variable type, for example, it will return a incorrect input response. Certainly, there could be better error handling. But again, for time limitations, I have left it as it is.  

Though unit testing is extremely important, because of time limitations, the application does not include unit testing. If I had more time, unit tests are something I would have absolutely included it because including unit tests are a good development practice that contribute to higher code quality and help find bugs within code. 

# Detailed Overview
The application initially creates a connection to the MySQL database and creates a table for the data. The Application then, using express, handles get routes that ingest data from a price data feed using Etherscan's REST API. I chose to use Etherscan over EthGasstation because I already had previous experience with Etherscan when working with smart contracts. 

After extracting the data, it then queries the data to the MySQL database appropriately. We are then able to access that data.

For the first GET request (GET "/gas"), after it extract the data and pushes it to the database, it sends the JSON response formatted with the correct data. An Important note: gas unit is measured in Gwei. 

As for the second GET request (GET "Average?fromTime:fromTime&toTime:toTime), the application converts the input timestamp to MySQL's format of a timestamp to find the correct data. It queries the relevant data needed for the request and sums the average prices and divides the sum by the number of blocks/rows in the database for the specified time interval (the average gas price between a specified interval). It then returns that value as a response.  


# Setup
The project was meant to be containerized in Docker for better usability. However, due to technical difficulties with my laptop, I wasn't able to do so. I apologize for the inconvenience. 

The project requires Node, Express, and MySQL to be installed as well as host a server on the user's local machine. Node-cron library must also be installed. 


MySQL must me up and running.

`npm install` to install dependencies.

`nodemon` to run the application on default port: 3000. 

In your Web Browser, go to `localhost:3000/createDB` to create the Database.

Then, `localhost:3000/createposttable` to create the table.

`localhost:3000/gas` to make the get requests. To populate the database, node-cron is supposed to call the getGas function every 10 seconds. However, this hasn't been working as well as I'd like it to. So, it's best to refresh the web browser on `localhost:3000/gas` every couple of seconds to populate database. Every refresh is a single post to the DB.  

Finally, `localhost:3000/Average?fromTime:fromTime&toTime:toTime` to get the average of the desired time interval. It's important to note that the users checks the exact time of the desired date in the MySQL database. Then, using https://www.unixtimestamp.com, convert that date to a timestamp. The user should do the previous step for both fromTime and toTime input variables. 
 
