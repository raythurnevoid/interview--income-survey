- Check the cloud logs to find the requests that are slow
    - Check the DB logs for slow queries
        - Improve the queries
            - Proper indexing
                - Use GIST or GIN for full text search
            - Prepared statements
            - SELECT EXPLAIN to find out for seq scans
        - Restrict the UI
            - Force the user to be more “precise” when searching for something
            - Pagination with infinite scroll
        - If possible opt for preparing the values in a table ahead of time, ETL job or Materialized Views
        - Avoid being stuck for db locks
        - Increase the HW power
    - Check for slowness due to high traffic or latency
        - Set up caching mechanisms to prevent hitting the DB every time
            - In-memory
            - Redis
        - Set up regional replicas to reduce the amount of user needing to query the DB or if the slowness is caused by the latency and not the high load
        - Increase the HW power
    - Check for logs that may clue some bottleneck in the server code
        - Set up caching mechanisms to prevent high load on the server
            - In-memory
                - Redis
            - Redis
        - Increase the number of parallel containers (assuming you are using something like Cloud-Run or ECS)
        - Extract long running functions to cloud functions to prevent bottlenecks for every other request
        - Use async code instead of serial whenever necessary and avoid idle processes
        - Increase the HW power
        - Split the server in 2 or more micro services
        - If the slowness is due to the latency between server and client then you need to deploy additional containers in various regions closer to the users.
        - Reduce the amount of data being served to the client, serve only what is actually used.
        - Use GraphQL or gRPC if necessary
- If no issue can be found in the cloud logs, the problem is in the UI (or the calling server)
    - Avoid any waterfall call
    - Reduce the amount of http calls
    - Remove libraries and trackers that may be bogging down the UI
    - If the app is fast but it takes a lot to load the page the first time, reduce the bundle size
    - Execute long running functions in a Worker if possible
    - If you are heavily using the localStorage, use IndexedDB instead that is async
    - Reduce the amount of data exchanged with the server and get only what is needed to the UI
    - If you are using React, use memo and useMemo whenever possible
 
80% of the time the slowness is caused by slow queries