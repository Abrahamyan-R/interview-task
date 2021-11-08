# interview-task
Nest js interview task

Steps to reproduce
1. Clone project
2. Start containers with docker-compose up --build -d command
3. Import postman collection and environment (for http requests)
4. Open demo.html via browser (for server sent events)

After making http request from postman we can see changes(events) in browser

For future
For scaling this application we can add load balancing config in nginx and puting new backend instances behind load balancer. In this case we should add some message broker to notify them about events. If we have mongo replication set, then instead of message broker we can subscribe to mongo change stream and receive events.